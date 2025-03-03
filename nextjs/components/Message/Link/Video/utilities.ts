import { isYoutubeWatchUrl, isYoutubeShortUrl } from '../utilities';

export function normalizeVideoUrl(url: string): string {
  if (isYoutubeShortUrl(url)) {
    const path = url.split('/').pop();
    return `https://www.youtube.com/embed/${path}`;
  }
  if (isYoutubeWatchUrl(url)) {
    const params = new URLSearchParams(url.split('?')[1]);
    const version = params.get('v');
    return `https://www.youtube.com/embed/${version}`;
  }
  return url;
}
