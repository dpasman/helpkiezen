import React from "react";

export function OutLink({ href, children, onClick }) {
  return (
    <a href={href} rel="nofollow sponsored" target="_blank" onClick={onClick}>
      {children}
    </a>
  );
}
