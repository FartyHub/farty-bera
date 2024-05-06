import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { useUser } from '../../contexts';
import { useTouchDevice } from '../../hooks';

export function VideoIntro() {
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [hasVideoEnded, setHasVideoEnded] = useState<boolean>(false);
  const { isLoading, user } = useUser();
  const { isTouch } = useTouchDevice();

  useEffect(() => {
    if (isLoading || !showVideo) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  function handleVideoEnded() {
    setHasVideoEnded(true);

    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  }

  return (
    <video
      autoPlay
      muted
      className={clsx(
        'fixed inset-0 object-cover size-full z-[1000]',
        'transition-opacity duration-500 ease-in-out',
        hasVideoEnded ? 'opacity-0' : 'opacity-100',
        showVideo && !isTouch ? 'visible' : 'hidden',
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
