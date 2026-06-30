import React from "react";
import { Link } from "react-router-dom";
import "../styles/breadcrumbs.css";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav className="app-breadcrumbs" aria-label="Breadcrumb">
      <ol className="app-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="app-breadcrumb-item" key={`${item.label}-${index}`}>
              {item.to && !isLast ? (
                <Link to={item.to} className="app-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="app-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}

              {!isLast && <span className="app-breadcrumb-separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
