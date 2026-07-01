import React, { useState, useEffect } from "react";
import { Menu, X, ShieldAlert, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import logoImg from "../assets/images/bene_brand_logo_1782911879088.jpg";
import { HomepageConfig } from "../types";

interface HeaderProps {
  onLoginClick: () => void;
  loggedInCompany: string | null;
  onLogout: () => void;
  config?: HomepageConfig;
}

export default function Header({ onLoginClick, loggedInCompany, onLogout, config }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "장애인 고용이 필요한 이유", href: "#why" },
    { label: "기업의 고민", href: "#pain-points" },
    { label: "솔루션 TOP 3", href: "#three-pillars" },
    { label: "부담금 계산기", href: "#calculator" },
    { label: "원스톱 행정", href: "#workflow" },
    { label: "ESG 효과", href: "#esg" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const isCustomLogo = !!(
    config?.logoUrl &&
    !config.logoUrl.includes("benepeople_logo") &&
    !config.logoUrl.includes("benepeople_new_logo") &&
    !config.logoUrl.includes("bene_brand_logo") &&
    config.logoUrl.trim() !== ""
  );
  const logoSource = isCustomLogo ? config.logoUrl : logoImg;
  const companyNameText = config?.companyName || "BenePeople";
  const companyLogoSubtext = config?.companyLogoText || "(주)베네피플";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || loggedInCompany
          ? "bg-[#073B31]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src={logoSource}
              alt="BenePeople Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                {companyNameText}
              </span>
              <span className="text-[9px] text-brand-accent font-semibold block tracking-wide">
                {companyLogoSubtext} {loggedInCompany ? "PORTAL" : ""}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          {!loggedInCompany ? (
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-gray-300 hover:text-brand-accent transition text-xs xl:text-sm font-semibold px-2 py-1.5 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
              <LayoutDashboard className="w-3.5 h-3.5 animate-pulse" />
              <span>[ {loggedInCompany} ] 회원사 전용 원격 관리 채널</span>
            </div>
          )}

          {/* Header Action Button */}
          <div className="hidden lg:block">
            {loggedInCompany && (
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            )}
          </div>

          {/* Mobile Hamburger menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 outline-none transition"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#073B31] border-b border-white/10 shadow-2xl py-4 px-4 space-y-2 animate-fadeIn">
          {!loggedInCompany ? (
            <>
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, item.href);
                  }}
                  className="block text-gray-300 hover:text-brand-accent transition text-sm font-semibold py-2 px-3.5 rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-400 justify-center">
                <LayoutDashboard className="w-3.5 h-3.5 animate-pulse" />
                <span>{loggedInCompany} 포탈 활성화</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
