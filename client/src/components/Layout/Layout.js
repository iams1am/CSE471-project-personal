import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Background from "./Background";
import { Container } from "react-bootstrap";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="d-flex flex-column min-vh-100 text-white">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Background />
      <Header />
      <main className="flex-grow-1 py-0">
        <Container>
          <Toaster position="top-right" />
          <div className="text-white fw-bold">
        {children}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Movie Ticketing App",
  description: "Book your movie tickets online",
  keywords: "movies, tickets, booking, cinema",
  author: "Your Name",
};

export default Layout;