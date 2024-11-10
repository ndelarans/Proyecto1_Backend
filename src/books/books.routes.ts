// book.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import {
  createBookController,
  updateBookController,
  deleteBookController,
  getBookController,
  getBooksController,
  reserveBookController
} from './book.controller';
import {
  createBookPermissionMiddleware,
  updateBookPermissionMiddleware,
  deleteBookPermissionMiddleware
} from '../middlewares/permissionMiddleware';
import { authMiddleware } from '../auth/authMiddleware';
import { AuthRequest } from '../custom';

const router = Router();

// Middleware y controladores para los endpoints
const handleError = (res: Response, message: string, error: any) =>
  res.status(500).json({ message, error });

const handleNotFound = (res: Response, message: string) =>
  res.status(404).json({ message });

// Crear un nuevo libro
const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await createBookController(req.body);
    res.status(201).json(book);
  } catch (error) {
    handleError(res, 'Failed to create book', error);
  }
};

// Actualizar un libro existente
const updateBook = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  
  try {
    const book = await updateBookController(bookId, req.body);
    if (!book) return handleNotFound(res, 'Book not found');
    
    res.status(200).json(book);
  } catch (error) {
    handleError(res, 'Failed to update book', error);
  }
};

// Eliminar un libro
const deleteBook = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  
  try {
    const book = await deleteBookController(bookId);
    if (!book) return handleNotFound(res, 'Book not found');
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    handleError(res, 'Failed to delete book', error);
  }
};

// Obtener un libro específico por ID
const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  
  try {
    const book = await getBookController(bookId);
    if (!book) return handleNotFound(res, 'Book not found');
    
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// Obtener una lista de libros con filtros
const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: any = { isActive: true };

    // Aplicar filtros opcionales a la búsqueda de libros
    if (req.query.genre) filters.genre = req.query.genre;
    if (req.query.publishedDate) filters.publishedDate = new Date(req.query.publishedDate as string);
    if (req.query.publisher) filters.publisher = req.query.publisher;
    if (req.query.author) filters.author = req.query.author;
    if (req.query.title) filters.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.isAvailable !== undefined) filters.isAvailable = req.query.isAvailable === 'true';

    const books = await getBooksController(filters);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// Reservar un libro
const reserveBook = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    const book = await reserveBookController(bookId, userId);
    if (!book) return res.status(404).json({ message: 'Book not found or already reserved' });

    res.status(200).json({ message: 'Book reserved successfully', book });
  } catch (error) {
    handleError(res, 'Failed to reserve book', error);
  }
};

// Rutas
router.post('/create', authMiddleware, createBookPermissionMiddleware, createBook);
router.put('/update/:bookId', authMiddleware, updateBookPermissionMiddleware, updateBook);
router.delete('/delete/:bookId', authMiddleware, deleteBookPermissionMiddleware, deleteBook);
router.get('/:bookId', getBook);
router.get('/', getBooks);
router.post('/reserve/:bookId', authMiddleware, reserveBook);

export default router;
