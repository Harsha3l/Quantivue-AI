import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "Getting Started with Web Hosting: A Beginner's Guide",
    excerpt:
      "Learn everything you need to know about web hosting, from choosing the right plan to launching your first website.",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    title: "10 WordPress Plugins Every Website Needs",
    excerpt:
      "Discover the essential WordPress plugins that will enhance your website's functionality and performance.",
    date: "Dec 18, 2024",
    readTime: "7 min read",
    category: "WordPress",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
  },
  {
    title: "How to Automate Your Business with n8n",
    excerpt:
      "Step-by-step guide to setting up powerful automation workflows using n8n on your hosting platform.",
    date: "Dec 15, 2024",
    readTime: "10 min read",
    category: "Automation",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    title: "Website Security Best Practices for 2024",
    excerpt:
      "Protect your website from threats with these essential security measures and tips.",
    date: "Dec 12, 2024",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Quantivue AI</title>
        <meta
          name="description"
          content="Learn about web hosting, WordPress, automation, and more from our expert guides and tutorials."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-16 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Quantivue AI Blog
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
                Tips, tutorials, and insights to help you succeed online.
              </p>
            </div>
          </section>

          {/* Posts */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {posts.map((post) => (
                  <article
                    key={post.title}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <Link
                        to="/blog"
                        className="inline-flex items-center text-accent font-medium hover:underline"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
