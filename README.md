# Argentinean Supermarket Price Comparator

This project aims to create a web application that compares prices of products from major Argentinean supermarkets. The application is built using Astro, TailwindCSS, Shadcn, Prisma, Playwright, and Node.js.

## Supermarkets Included
- Coto
- Jumbo
- Carrefour Argentina
- Disco
- Dia Argentina
- Chango Más
- Vea

## Project Structure

### Frontend
- **Astro**: Static site generator for building the frontend.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Shadcn**: Component library for building UI components.

### Backend
- **Node.js**: JavaScript runtime for the backend.
- **Prisma**: ORM for database management.

### Testing
- **Playwright**: End-to-end testing framework for scraping product data from supermarket websites.

## Database Schema

The database schema is managed by Prisma. Each product has an EAN, name, supermarket, and price. The schema is designed to store all products and their prices in a single database.
