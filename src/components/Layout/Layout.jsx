import Footer from '../Footer/Footer';
import Header from '../Header/Header';

function Layout({ children }) {
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <Header />
      <main className="flex-grow-1 overflow-auto">
        <div className="container py-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
