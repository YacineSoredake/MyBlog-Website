// script.js
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');
    const dis = document.getElementById('createHidden');
    const link = document.getElementById('link')
    const scrollTrigger = 50; // Adjust this value to change the scroll trigger point
  
    window.addEventListener('scroll', () => {

      if (window.scrollY > scrollTrigger) {
        header.classList.add('header-scrolled');
        dis.style.display = "block";
        link.style.color = "black";
      } else {
        header.classList.remove('header-scrolled');
        dis.style.display = "none";
        link.style.color = "white";

      }
    });
  });
  