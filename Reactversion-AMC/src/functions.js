// function mode() {
//   const body = document.body;
//   const currentTheme = localStorage.getItem('theme') || 'light';
//   const newTheme = currentTheme === 'light' ? 'dark' : 'light';

//   if (newTheme === 'dark') {
//     body.classList.add('dark-mode');
//     body.classList.remove('bg-white', 'text-dark');
//   } else {
//     body.classList.remove('dark-mode');
//     body.classList.add('bg-white', 'text-dark');
//   }

//   localStorage.setItem('theme', newTheme);
// }

// document.addEventListener("DOMContentLoaded", async () => {
//   // Apply theme on load
//   const savedTheme = localStorage.getItem('theme') || 'light';
//   if (savedTheme === 'dark') {
//     document.body.classList.add('dark-mode');
//     document.body.classList.remove('bg-white', 'text-dark');
//   } else {
//     document.body.classList.add('bg-white', 'text-dark');
//     document.body.classList.remove('dark-mode');
//   }

//   });

// export default mode;

function mode() {
  const html = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  if (newTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  localStorage.setItem('theme', newTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const html = document.documentElement;
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
});

export default mode;
