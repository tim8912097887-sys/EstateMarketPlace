import { Link } from "react-router"
import { FaSearch } from "react-icons/fa"

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md">
       <div className="flex justify-between items-center mx-auto p-3 max-w-6xl">
          <Link to="/">
             {/* Small text for phone */}
             <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
                <span className='text-slate-500'>Sahand</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
          </Link>
       <form className="flex items-center rounded-lg bg-slate-100 p-3">
          {/* Small width for phone */}
          <input className="bg-transparent focus:outline-none w-24 sm:w-64" placeholder="Search..." type="text"  id="" />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
       </form>
       <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
          </Link>
          <Link to="/signin">
            <li className="text-slate-700 hover:underline">Sign In</li>
          </Link>
       </ul>
       </div>
    </header>
  )
}

export default Header