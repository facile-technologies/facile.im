export default function PageWrapper({ children }) {
  return (
    <div className="page-enter page-enter-active min-h-screen">{children}</div>
  );
}
