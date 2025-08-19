"use client";
import React, { useEffect } from 'react';
import Link from "next/link";

import './home.css';

export default function Home() {
  useEffect(() => {
    // Create floating particles
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      
      const bgEffect = document.querySelector('.home-bg-effect');
      if (bgEffect) {
        bgEffect.appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
          }
        }, 20000);
      }
    }

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 2000);

    // Add mouse movement effect
    const handleMouseMove = (e) => {
      const container = document.querySelector('.home-main-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x / rect.width * 10;
        const moveY = y / rect.height * 10;
        
        container.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    // Reset position when mouse leaves
    const handleMouseLeave = () => {
      const container = document.querySelector('.home-main-container');
      if (container) {
        container.style.transform = 'translate(0, 0)';
      }
    };

    // Add click ripple effect to buttons
    const handleButtonClick = (e) => {
      
      
      const ripple = document.createElement('span');
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
      `;
      
      e.currentTarget.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    };

    // Typewriter effect for subtitle
    const typeWriter = (element, text, speed = 50) => {
      let i = 0;
      element.innerHTML = '';
      
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    };

    // Apply typewriter effect after component mount
    const typewriterTimeout = setTimeout(() => {
      const subtitle = document.querySelector('.home-subtitle');
      if (subtitle) {
        const originalText = subtitle.innerHTML;
        typeWriter(subtitle, originalText, 30);
      }
    }, 1500);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    

    // Cleanup function
    return () => {
      clearInterval(particleInterval);
      clearTimeout(typewriterTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-bg-overlay"></div>
      <div className="home-bg-effect">
        <div className="home-blob home-blob1"></div>
        <div className="home-blob home-blob2"></div>
        <div className="home-blob home-blob3"></div>
      </div>
      <div className="scan-line"></div>

      <main className="home-main-container">
        <div className="home-logo-container">
          <div className="home-logo">👁️</div>
        </div>

        <div className="home-title-section">
          <h1 className="home-main-title">Eye Auth</h1>
          <p className="home-subtitle">
            ระบบยืนยันตัวตนด้วยการสแกนดวงตา
             
           </p>
        </div>

        <div className="home-buttons-container">
  <Link href="/login" className="home-btn home-btn-login">
    เข้าสู่ระบบ
  </Link>

  <Link href="/register" className="home-btn home-btn-register">
    สมัครสมาชิก
  </Link>
</div>

        <div className="home-footer-text">
          <p>Powered by Advanced Biometric Technology</p>
        </div>
      </main>
    </div>
  );
}