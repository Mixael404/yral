function Header() {
  return (
    <header className="bg-dark text-white flex-shrink-0">
      <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-1">
        <div>
          <div className="fs-5 fw-semibold">Поиск автозапчастей</div>
          <div className="small text-white-50">Тестовое задание</div>
        </div>
        <div className="small">
          <span className="text-white-50">Исполнитель:</span> Слуцкий Михаил
        </div>
      </div>
    </header>
  );
}

export default Header;
