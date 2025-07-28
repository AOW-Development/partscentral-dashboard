import Header from "../components/Header";
import Image from "next/image";
import Sidebar from "../components/Sidebar";

export default function ProductionPage() {
  return (
    <div className="min-h-screen bg-main text-white font-exo">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="md:pl-64">
        {/* Header */}
        <Header />
        {/* Scrollable Content */}
        <main className="pt-[120px] h-[calc(100vh-0px)] overflow-y-auto px-4 md:px-8">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="search"
                  className="bg-[#091e36] rounded-lg pl-10 pr-4 py-2 w-full text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <select className="bg-[#091e36] rounded-lg px-4 py-2 text-white focus:outline-none w-full md:w-auto">
                <option>Engines</option>
                <option>Transmission</option>
                <option>Brakes</option>
              </select>
            </div>
            <div>
              <select className="bg-[#091e36] rounded-lg px-4 py-2 text-white focus:outline-none w-full md:w-auto">
                <option>Instock</option>
                <option>Outstock</option>
              </select>
            </div>
            <div>
              <button className="flex items-center bg-[#091e36] rounded-lg px-4 py-2 text-white w-full md:w-auto justify-center">
                Add
                <svg
                  className="ml-2"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-6">Production</h1>
          {/* <div className="bg-[#0a1e36] rounded-xl p-4 md:p-6"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#07182C] to-[#03101E] rounded-xl p-4 flex flex-col shadow-lg relative border border-[#1a2b44]"
                >
                  {/* Status badge */}
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      idx === 5 ? "bg-[#f64e4e]" : "bg-[#1ecb4f]"
                    }`}
                  >
                    {idx === 5 ? "outstock" : "instock"}
                  </span>
                  {/* More icon */}
                  <span className="absolute top-4 right-4 text-gray-400 cursor-pointer">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </span>
                  {/* Product image */}
                  <div className="flex justify-center mb-4 mt-2">
                    {/* <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6ddcff] to-[#1e90ff] flex items-center justify-center"> */}
                      <Image
                        width={64}
                        height={64}
                        src="/engine.png"
                        alt="Engine"
                        className="w-full h-full object-contain"
                      />
                    {/* </div> */}
                  </div>
                  {/* Product info */}
                  <div className="text-lg font-bold tracking-wide">
                    GASOLINE
                  </div>
                  <div className="text-xs text-gray-400 mb-2">ENGINE</div>
                  <div className="text-base font-semibold mb-2">100$</div>
                  <div className="text-xs text-gray-300 mb-3">
                    Get your favorite products delivered automatically, enjoy
                    exclusive discounts, skip or cancel anytime. Convenience and
                    savings in one click.
                  </div>
                  {/* Sales and Quantity */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Sales</span>
                    <span className="flex items-center gap-1 text-green-400 font-semibold">
                      220{" "}
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 15l6-6 6 6" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span>Quantity</span>
                    <div className="flex-1 h-2 bg-[#1a2b44] rounded-full overflow-hidden">
                      <div className="h-2 bg-[#1ecb4f] w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
