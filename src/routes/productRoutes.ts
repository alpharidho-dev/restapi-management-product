import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { createProduct, getProducts } from '../controllers/productController';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), createProduct);
router.get('/', getProducts);

export default router;