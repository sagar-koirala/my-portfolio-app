import React from 'react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
}

const testimonialsPlaceholder: Testimonial[] = [
  {
    id: "1",
    quote: "Exceptional firmware architecture and debugging skills. Delivered a stable RTOS system ahead of schedule.",
    author: "Jane Doe",
    role: "VP of Engineering",
    company: "Robotics Corp",
  },
  {
    id: "2",
    quote: "Superb PCB design. Optimised our board space and resolved high-speed signal integrity issues perfectly.",
    author: "John Smith",
    role: "Lead Hardware Architect",
    company: "IoT Systems LLC",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold tracking-tight text-neutral-100 mb-8">Client Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonialsPlaceholder.map((item) => (
          <div key={item.id} className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <p className="text-sm italic text-neutral-300">"{item.quote}"</p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-neutral-200">{item.author}</h4>
              <p className="text-xs text-neutral-500">
                {item.role} {item.company ? `at ${item.company}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
