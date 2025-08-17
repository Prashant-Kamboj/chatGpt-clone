import { AIModelSelector } from "./AIModelSelector";

export const Header = () => {
  return (
    <header className="w-full bg-white h-[60px] shadow-md py-4 px-6 flex justify-between items-center fixed top-0">
      <h1 className="text-xl font-bold">ChatGPT Clone</h1>
      <nav className="">
        <ul className="flex items-center space-x-4">
          <li>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              About
            </a>
          </li>
          <li className="flex flex-row items-center space-x-2">
            <span>AI Model</span>
            <AIModelSelector />
          </li>
        </ul>
      </nav>
    </header>
  );
};
