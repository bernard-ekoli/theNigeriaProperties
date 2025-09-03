
export const metadata = {
  title: "TheNigeriaProperties",
  description: "Find your dream home in Nigeria",
  icons: {
    icon: "/LOGO.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
