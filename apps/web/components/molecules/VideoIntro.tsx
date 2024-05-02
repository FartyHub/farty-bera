import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useUser } from '../../contexts';

export function VideoIntro() {
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [hasVideoEnded, setHasVideoEnded] = useState<boolean>(false);
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      setHasVideoEnded(true);
      setTimeout(() => {
        setShowVideo(false);
      }, 1000);
    } else {
      setShowVideo(true);
    }
  }, [user, isLoading]);

  function handleVideoEnded() {
    setHasVideoEnded(true);

    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  }

  if (!showVideo) {
    return null;
  }

  return (
    <video
      autoPlay
      muted
      className={clsx(
        'fixed inset-0 object-cover size-full z-[1000]',
        'transition-opacity duration-500 ease-in-out',
        hasVideoEnded ? 'opacity-0' : 'opacity-100',
        showVideo ? 'visible' : 'hidden',
      )}
      onEnded={handleVideoEnded}
    >
      <source
        src="https://storage.googleapis.com/farty-bera-build/intro.webm"
        type="video/webm"
      />
    </video>
  );
}
