import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { sendSuccess, sendError } from '../utils/response';
import { uploadToSupabase, supabase, BUCKET_NAME } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getImage = async (req: Request, res: Response) => {
  try {
    const { category, name } = req.params;
    const filename = name || category;
    const folder = name ? category : 'uploads';

    // 1. Check local uploads directory
    const localUploadsDir = path.join(process.cwd(), 'uploads');
    const possiblePaths = [
      path.join(localUploadsDir, folder, filename),
      path.join(localUploadsDir, filename),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }
    }

    // Check with common extensions (.png, .jpg, .svg, .webp) if extension omitted
    const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    for (const ext of extensions) {
      const extPath = path.join(localUploadsDir, `${filename}${ext}`);
      if (fs.existsSync(extPath) && fs.statSync(extPath).isFile()) {
        return res.sendFile(extPath);
      }
    }

    // 2. Fetch or redirect from Supabase Cloud Storage
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabasePath = name ? `${category}/${name}` : `uploads/${filename}`;
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(supabasePath);
      if (data && data.publicUrl) {
        return res.redirect(data.publicUrl);
      }
    }

    return sendError(res, `Image asset '${filename}' not found`, 404);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to serve image', 500);
  }
};

export const uploadShortImage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    const category = (req.body.category as string) || 'uploads';
    const rawName = path.parse(req.file.originalname).name;
    const cleanName = rawName.toLowerCase().replace(/[^\w-]/g, '_');
    const ext = path.extname(req.file.originalname) || '.png';
    const shortFileName = `${cleanName}_${Date.now().toString(36)}${ext}`;

    const host = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${host}/api/images/${category}/${shortFileName}`;

    // Upload to Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        await uploadToSupabase(fileBuffer, shortFileName, req.file.mimetype, category);
      } catch (err: any) {
        console.warn('Supabase storage upload fallback:', err.message);
      }
    }

    return sendSuccess(
      res,
      'Image asset uploaded successfully with clean short URL',
      {
        shortUrl,
        filename: shortFileName,
        category,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      201
    );
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to upload image asset', 500);
  }
};
