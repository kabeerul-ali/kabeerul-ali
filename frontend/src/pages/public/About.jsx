import "../../style/About.css"
import {
  Code2,
  GraduationCap,
  Rocket,
  Lightbulb,
} from "lucide-react";

import { useProfile } from "../../context/ProfileContext";

function About() {
  const { profile } = useProfile();

  const name = profile?.name || "Kabeerul Ali";

  const designation =
    profile?.designation || "Full Stack MERN Developer";

  const highlights = [
    {
      icon: Code2,
      title: "Development",
      description: "Building modern and scalable web applications.",
    },
    {
      icon: GraduationCap,
      title: "Learning",
      description:
        "Continuously improving technical and problem-solving skills.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description:
        "Turning creative ideas into useful digital products.",
    },
    {
      icon: Lightbulb,
      title: "Problem Solving",
      description: "Focused on practical solutions and clean code.",
    },
  ];

  return (
    <section className="about-page section">
      <div className="container">
        <div className="about-heading">
          <span className="about-eyebrow">GET TO KNOW ME</span>

          <h1 className="section-heading">
            About <span className="gradient-text">Me.</span>
          </h1>

          <p>
            {profile?.tagline ||
              "A developer driven by curiosity, creativity and technology."}
          </p>
        </div>

        <div className="about-content">
          <div className="about-story glass-card">
            <span className="about-card-label">MY JOURNEY</span>

            <h2>Creating with code, building with purpose.</h2>

            {profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <>
                <p>
                  I'm {name}, a {designation} with an interest
                  in building interactive websites and meaningful digital
                  experiences.
                </p>

                <p>
                  I work with modern web technologies and enjoy exploring
                  frontend development, backend architecture, APIs and
                  real-world application development.
                </p>

                <p>
                  My goal is to keep learning, build impactful products and
                  grow as a software engineer.
                </p>
              </>
            )}

            {profile?.location && (
              <p>
                <strong>Location:</strong> {profile.location}
              </p>
            )}
          </div>

          <div className="about-highlights">
            {highlights.map(({ icon: Icon, title, description }) => (
              <article className="about-highlight glass-card" key={title}>
                <div className="about-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
