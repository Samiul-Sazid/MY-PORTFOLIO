'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, GraduationCap, Code, Mail, Github, Linkedin, Twitter, Download, Award } from 'lucide-react';

// ===== MOUSE-INTERACTIVE NEURAL NETWORK BACKGROUND =====
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: any[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction (repel slightly)
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.current.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.current.radius - dist) / mouse.current.radius;
          p.vx -= Math.cos(angle) * force * 0.2;
          p.vy -= Math.sin(angle) * force * 0.2;
        }

        // Draw particle (neuron) — stronger glow, cyan-blue tint
        ctx.beginPath();
        const glow = Math.max(0.6, 1 - dist / 200); // higher base glow
        const color = `rgba(0, 255, 255, ${glow})`; // neon cyan-blue
        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0, 255, 255, 1)";
        ctx.shadowBlur = 15;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Connect nearby particles — brighter glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 120) {
            const alpha = 1 - dist2 / 120;
            const mouseDist = Math.sqrt(
              (mouse.current.x - (p.x + p2.x) / 2) ** 2 +
              (mouse.current.y - (p.y + p2.y) / 2) ** 2
            );
            const mouseGlow = Math.max(0, 1 - mouseDist / 200);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * (0.5 + mouseGlow * 0.8)})`;
            ctx.lineWidth = 0.8;
            ctx.shadowColor = "rgba(0, 255, 255, 0.9)";
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY + window.scrollY;
    };
    const handleMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
      }}
    />
  );
};




// ===== NAVIGATION BAR =====
const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'education'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', gradient: 'from-blue-500/20 to-blue-600/10' },
    { id: 'about', icon: User, label: 'About', gradient: 'from-purple-500/20 to-purple-600/10' },
    { id: 'skills', icon: Code, label: 'Skills', gradient: 'from-green-500/20 to-green-600/10' },
    { id: 'projects', icon: Briefcase, label: 'Projects', gradient: 'from-orange-500/20 to-orange-600/10' },
    { id: 'education', icon: GraduationCap, label: 'Education', gradient: 'from-red-500/20 to-red-600/10' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 p-2 rounded-2xl bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 shadow-xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ul className="flex items-center gap-2">
        {menuItems.map((item) => (
          <motion.li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-gray-900 dark:text-white bg-gradient-to-r ' + item.gradient
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm hidden sm:inline">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

// ===== HERO SECTION =====
const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 relative">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <motion.div
              className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src="https://photos.app.goo.gl/nGRK16N9x6JHiv5r9"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-500 animate-pulse border-4 border-black"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h4 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
            Hi, I’m <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Samiul Sazid Sammo</span> 
          </h4>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            An aspiring <span className="text-blue-350">IoT & Robotics Engineer</span> passionate about building smart systems that blend
            intelligence with automation.
          </p>

          

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/30"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ===== ABOUT SECTION =====
const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        className="max-w-4xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <section id="about" className="py-20 bg-transparent text-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-8">About Me</h2>
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              I’m <span className="text-cyan-400 font-semibold">Samiul Sazid Sammo</span>, 
              a passionate student of <span className="text-cyan-400">IoT and Robotics Engineering </span> 
              currently parsueing Engineering degree in <span className="text-cyan-400">University Of Frontier Technology, Bangladesh </span> 
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-center mt-6">
              I love turning ideas into interactive and intelligent solutions — whether it’s 
              building autonomous robots, developing web interfaces, or experimenting with 
              embedded systems. My goal is to push the boundaries of innovation and contribute 
              to the future of intelligent automation.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-center mt-6">
              I’m constantly learning, improving, and exploring new technologies. 
              When I’m not coding or soldering circuits, you’ll probably find me 
              brainstorming project ideas or designing something creative.
            </p>
          </div>
        </section>

      </motion.div>
    </section>
  );
};

// ===== SKILLS SECTION =====
const SkillsSection = () => {
  const skills = [
    { name: 'C++', level: 60 },
    { name: 'Python', level: 50 },
    { name: 'Machine Learning', level: 5 },
    { name: 'Next.js', level: 20 },
    { name: 'Node.js', level: 60 },
    { name: "Express.js", level: 78 },
    { name:  "Raspberry Pi", level: 55 },
    { name: "IoT System Design", level: 60 },
    { name: "My SQL", level: 78 },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        className="max-w-4xl mx-auto w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 10, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-medium text-lg">{skill.name}</span>
                <span className="text-blue-400 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ===== PROJECTS SECTION =====
const ProjectsSection = () => {
  const projects = [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Dashboard Analytics' },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80', title: 'Mobile App Design' },
    { id: 3, imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', title: 'E-commerce Platform' },
    { id: 4, imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', title: 'Portfolio Website' },
    { id: 5, imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', title: 'AI Chat Interface' },
    { id: 6, imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80', title: 'Travel Booking App' },
  ];

  return (
    <section id="projects" className="min-h-screen px-4 py-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Featured Projects</h2>
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3" style={{ columnWidth: '280px' }}>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="mb-6 break-inside-avoid relative group cursor-pointer"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-end">
                  <p className="text-white font-bold text-xl">{project.title}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ===== EDUCATION & CERTIFICATES SECTION =====
const EducationSection = () => {
  const education = [
    { degree: 'Bachelor in Iot and Robotics Engineering', institution: 'University of Frontier Technology, Bangladesh', year: '2023 - 2027' },
    { degree: 'HSC', institution: 'Rajshahi College', year: '2021' },
  ];

  const certificates = [
    // { name: 'AWS Certified Developer', issuer: 'Amazon', year: '2023' },
    // { name: 'React Advanced Patterns', issuer: 'Frontend Masters', year: '2023' },
    { name: 'Supervised Machine Learning: Regression and Classification', issuer: 'Coursera', year: '2024' },
  ];

  return (
    <section id="education" className="min-h-screen px-4 py-20">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Education & Certificates</h2>
        
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <GraduationCap className="w-8 h-8" /> Education
          </h3>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-4 border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
              <p className="text-gray-300">{edu.institution}</p>
              <p className="text-gray-400 text-sm mt-1">{edu.year}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-8 h-8" /> Certificates
          </h3>
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-4 border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h4 className="text-xl font-bold text-white mb-2">{cert.name}</h4>
              <p className="text-gray-300">{cert.issuer}</p>
              <p className="text-gray-400 text-sm mt-1">{cert.year}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-xl flex items-center gap-3 mx-auto"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ===== FOOTER WITH DOCK =====
const Footer = () => {
  const mouseX = useMotionValue(Infinity);

  const DockIcon = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    const distance = useTransform(mouseX, (val) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-140, 0, 140], [36, 60, 36]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
      <motion.div ref={ref} style={{ width }} className="flex aspect-square items-center justify-center">
        <a href={href} className="flex h-full w-full items-center justify-center">
          {children}
        </a>
      </motion.div>
    );
  };

  return (
    <footer className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex h-[58px] items-center gap-2 rounded-2xl bg-white/80 dark:bg-black/70 px-2 border border-white/20 backdrop-blur-xl mx-auto w-fit"
        >
          <DockIcon href="#home">
            <Home className="h-full w-full p-2 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockIcon href="samiulsazid1234@gmail.com">
            <Mail className="h-full w-full p-2 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockIcon href="https://github.com/Samiul-Sazid">
            <Github className="h-full w-full p-2 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockIcon href="https://linkedin.com">
            <Linkedin className="h-full w-full p-2 text-gray-700 dark:text-gray-300" />
          </DockIcon>
          <DockIcon href="https://twitter.com">
            <Twitter className="h-full w-full p-2 text-gray-700 dark:text-gray-300" />
          </DockIcon>
        </motion.div>
        <p className="text-gray-400 mt-8">© 2025 Your Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

// ===== MAIN APP =====
export default function Portfolio() {
  return (
    <div className="relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)',
        }}
      />
      <NeuralBackground />
      <NavigationBar />
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <Footer />
      </div>
    </div>
  );
}