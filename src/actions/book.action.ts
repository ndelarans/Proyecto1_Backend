import Book, { IBook } from '../books/book.model';

// Crear un nuevo libro
export const createBookAction = async (bookData: Partial<IBook>): Promise<IBook> => {
  const newBook = new Book(bookData);
  await newBook.save();
  return newBook;
};

// Actualizar un libro existente
export const updateBookAction = async (bookId: string, updates: Partial<IBook>): Promise<IBook | null> => {
  const updatedBook = await Book.findByIdAndUpdate(bookId, updates, { new: true });
  return updatedBook;
};

// Eliminar un libro (cambiar el estado a inactivo)
export const deleteBookAction = async (bookId: string): Promise<IBook | null> => {
  const deletedBook = await Book.findByIdAndUpdate(bookId, { isActive: false }, { new: true });
  return deletedBook;
};

// Obtener un libro específico
export const getBookAction = async (bookId: string): Promise<IBook | null> => {
  const foundBook = await Book.findOne({ _id: bookId, isActive: true });
  return foundBook;
};

// Obtener una lista de libros con filtros aplicados
export const getBooksAction = async (filters: any): Promise<IBook[]> => {
  const booksList = await Book.find(filters);
  return booksList;
};

// Reservar un libro para un usuario específico
export const reserveBookAction = async (bookId: string, userId: string): Promise<IBook | null> => {
  const bookToReserve = await Book.findById(bookId);
  
  if (!bookToReserve || !bookToReserve.isActive || !bookToReserve.isAvailable) {
    return null;
  }

  bookToReserve.reservedBy.push({
    userId,
    reservedDate: new Date(),
    returnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  bookToReserve.isAvailable = false;
  await bookToReserve.save();
  
  return bookToReserve;
};
