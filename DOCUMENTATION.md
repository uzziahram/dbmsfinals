# DBMS Final Project Documentation

## 1. Database Design

### ER Diagram (Conceptual)
- **Members**: Stores user information (id, name, username, email, password, address, created_at).
- **Authors**: Stores book authors (id, name).
- **Books**: Stores general book info (id, title, author_id, description, published_year).
- **Genres**: Stores available book genres (id, name).
- **Book_Genres**: Junction table for Books and Genres (book_id, genre_id).
- **Book_Copies**: Stores specific formats of books (id, book_id, format, stock, file_path, price).
- **Borrow_Logs**: Tracks book borrowings (id, member_id, book_copy_id, status, borrowed_at, due_date, returned_at).
- **Purchase_Logs**: Tracks book purchases (id, member_id, book_copy_id, quantity, total_price, purchased_at).

### Relational Schema
1.  members (id, name, username, email, password, address, created_at)
2.  authors (id, name)
3.  books (id, title, author_id, description, published_year)
4.  genres (id, name)
5.  book_genres (book_id, genre_id)
6.  book_copies (id, book_id, format, stock, file_path, price)
7.  borrow_logs (id, member_id, book_copy_id, status, borrowed_at, due_date, returned_at)
8.  purchase_logs (id, member_id, book_copy_id, quantity, total_price, payment_amount, change_amount, purchased_at)

---

## 2 & 3. SQL Queries and Relational Algebra Translation

### Query 1: Selection with AND & Projection
**Scenario**: "Find all members who registered after January 1st, 2024 and live in 'Manila'."
**SQL**: `SELECT name, email FROM members WHERE created_at > '2024-01-01' AND address LIKE '%Manila%';`
**Relational Algebra**: pi_{name, email}(sigma_{created_at > '2024-01-01' AND address LIKE '%Manila%'}(members))

### Query 2: Selection with OR
**Scenario**: "Search for books with 'Mystery' in the title or published in 2023."
**SQL**: `SELECT title, published_year FROM books WHERE title LIKE '%Mystery%' OR published_year = 2023;`
**Relational Algebra**: pi_{title, published_year}(sigma_{title LIKE '%Mystery%' OR published_year = 2023}(books))

### Query 3: Cartesian Product Condition (Join Simulation)
**Scenario**: "List all books along with their author names."
**SQL**: `SELECT b.title, a.name AS author_name FROM books b, authors a WHERE b.author_id = a.id;`
**Relational Algebra**: pi_{title, name}(sigma_{books.author_id = authors.id}(books x authors))

### Query 4: UNION Query
**Scenario**: "Show a unified history of all transaction types for a member."
**SQL**: `(SELECT 'BORROW' as type, borrowed_at FROM borrow_logs WHERE member_id = 1) UNION (SELECT 'PURCHASE' as type, purchased_at FROM purchase_logs WHERE member_id = 1);`
**Relational Algebra**: pi_{'BORROW', borrowed_at}(sigma_{member_id=1}(borrow_logs)) U pi_{'PURCHASE', purchased_at}(sigma_{member_id=1}(purchase_logs))

### Query 5: DIFFERENCE Query
**Scenario**: "Find books that have NEVER been borrowed."
**SQL**: `SELECT title FROM books WHERE id NOT IN (SELECT bc.book_id FROM borrow_logs bl, book_copies bc WHERE bl.book_copy_id = bc.id);`
**Relational Algebra**: pi_{title}(books) - pi_{title}(books |><| (pi_{book_id}(sigma_{bl.book_copy_id = bc.id}(borrow_logs x book_copies))))

---

## 4. System Implementation
Accessible via /query-lab.
