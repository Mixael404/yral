const LINKS = [
  { title: 'Резюме', href: 'https://hh.ru/resume/e1c0836cff1029c7fa0039ed1f4453694e5831' },
  { title: 'Telegram', href: 'https://t.me/pravda_misha' },
  { title: 'Max', href: 'https://max.ru/u/f9LHodD0cOKZHOMhIoKqPY5hK-AtDsikmroBO9Au70tmyUbG13IaNmTRHaA' },
];

function Footer() {
  return (
    <footer className="bg-body-tertiary border-top flex-shrink-0">
      <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 small">
        <div className="text-secondary">Тестовое задание · Слуцкий Михаил</div>
        <ul className="nav gap-3">
          {LINKS.map(({ title, href }) => (
            <li key={title} className="nav-item">
              <a
                className="link-secondary link-underline-opacity-0 link-underline-opacity-75-hover"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
