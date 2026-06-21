import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SEO = () => {
  useEffect(() => {
    const fetchSEOSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          // Dynamic title update
          if (data.meta_title) {
            document.title = data.meta_title;
          }

          // Dynamic description meta update
          if (data.meta_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.meta_description;
          }

          // Dynamic keywords meta update
          if (data.meta_keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.name = 'keywords';
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = data.meta_keywords;
          }

          // Dynamic author meta update
          if (data.author) {
            let metaAuthor = document.querySelector('meta[name="author"]');
            if (!metaAuthor) {
              metaAuthor = document.createElement('meta');
              metaAuthor.name = 'author';
              document.head.appendChild(metaAuthor);
            }
            metaAuthor.content = data.author;
          }

          // Dynamic robots meta update
          if (data.robots) {
            let metaRobots = document.querySelector('meta[name="robots"]');
            if (!metaRobots) {
              metaRobots = document.createElement('meta');
              metaRobots.name = 'robots';
              document.head.appendChild(metaRobots);
            }
            metaRobots.content = data.robots;
          }
        }
      } catch (err) {
        console.warn('SEO settings failed to load dynamically: relying on index.html static values.');
      }
    };

    fetchSEOSettings();
  }, []);

  return null; // This component handles side effects and renders no UI
};

export default SEO;
