import React from 'react';

const ListenerImg = () => (
  <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="100%" height="100%" fill="#FEDBD0" />

    {/* Person silhouette */}
    <circle cx="100" cy="100" r="70" fill="#F4AFA0" />
    <path d="M100,170 Q60,200 100,230 Q140,200 100,170 Z" fill="#F4AFA0" />
    <rect x="85" y="230" width="30" height="70" fill="#F4AFA0" />

    {/* Headphones */}
    <circle cx="130" cy="90" r="10" fill="#E07A5F" />
    <circle cx="70" cy="90" r="10" fill="#E07A5F" />
    <rect x="75" y="85" width="50" height="10" fill="#E07A5F" />

    {/* Smile */}
    <path d="M85,110 Q100,120 115,110" fill="none" stroke="#E07A5F" strokeWidth="2" />

    {/* Eyes */}
    <circle cx="90" cy="85" r="3" fill="#333" />
    <circle cx="110" cy="85" r="3" fill="#333" />
  </svg>
);

export default ListenerImg;
