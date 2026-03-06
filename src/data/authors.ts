/**
 * Author registry for SellOnTube blog posts.
 *
 * Keys must match the `author:` value in post frontmatter exactly.
 * Images reference existing team photos — do not duplicate them.
 */

import type { ImageMetadata } from 'astro';

import sathyanandPhoto from '../assets/images/team/Sathya Profile Photo.jpg';
import gauthamPhoto from '../assets/images/team/Gautham Profile Photo.jpg';

export interface AuthorEntry {
  name: string;
  role: string;
  linkedin: string;
  photo: ImageMetadata;
  photoAlt: string;
}

export const authors: Record<string, AuthorEntry> = {
  Sathyanand: {
    name: 'Sathyanand S',
    role: 'Co-Founder, SellOnTube',
    linkedin: 'https://www.linkedin.com/in/sathyanands/',
    photo: sathyanandPhoto,
    photoAlt: 'Sathyanand S, Co-Founder of SellOnTube',
  },
  Gautham: {
    name: 'Gautham',
    role: 'Co-Founder, SellOnTube',
    linkedin: 'https://www.linkedin.com/in/mindcharting/',
    photo: gauthamPhoto,
    photoAlt: 'Gautham, Co-Founder of SellOnTube',
  },
};
