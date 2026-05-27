import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Assignment } from '../models/Assignment';
import { assignmentQueue } from '../services/queue';
import { wsManager } from '../services/wsManager';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
  },
});

// GET all assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: assignments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single assignment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create assignment
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, additionalInfo } = req.body;

    if (!title || !dueDate || !questionTypes) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    let parsedTypes = questionTypes;
    if (typeof questionTypes === 'string') {
      parsedTypes = JSON.parse(questionTypes);
    }

    // Validate question types
    for (const qt of parsedTypes) {
      if (!qt.type || qt.count <= 0 || qt.marks <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid question type data' });
      }
    }

    const assignment = new Assignment({
      title,
      dueDate,
      questionTypes: parsedTypes,
      additionalInfo: additionalInfo || '',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      fileName: req.file?.originalname,
      status: 'pending',
    });

    await assignment.save();

    // Read file content if uploaded (for text extraction context)
    let fileContent: string | undefined;
    if (req.file && req.file.mimetype === 'application/pdf') {
      // For simplicity, skip PDF parsing — AI will use additionalInfo
      fileContent = `[File uploaded: ${req.file.originalname}]`;
    }

    // Add to queue
    const job = await assignmentQueue.add(
      'generate',
      { assignmentId: assignment._id.toString(), fileContent },
      { jobId: `assignment-${assignment._id}` }
    );

    assignment.jobId = job.id;
    assignment.status = 'processing';
    await assignment.save();

    // Notify via WS that processing started
    wsManager.notifyAssignment(assignment._id.toString(), {
      status: 'processing',
      progress: 5,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (err: any) {
    console.error('Create assignment error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE assignment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST regenerate
router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, error: 'Not found' });

    assignment.status = 'processing';
    assignment.generatedPaper = undefined;
    assignment.error = undefined;
    await assignment.save();

    const job = await assignmentQueue.add(
      'generate',
      { assignmentId: assignment._id.toString() },
      { jobId: `assignment-${assignment._id}-${Date.now()}` }
    );

    assignment.jobId = job.id;
    await assignment.save();

    wsManager.notifyAssignment(assignment._id.toString(), { status: 'processing', progress: 5 });

    res.json({ success: true, data: assignment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
