import { useQuery } from '@tanstack/react-query';

import { getTwitterOAuthLink } from '../../services';

export const TWITTER_OAUTH_LINK_QUERY = 'TWITTER_OAUTH_LINK';

export function useGetTwitterOAuthLinkQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getTwitterOAuthLink,
    queryKey: [TWITTER_OAUTH_LINK_QUERY],
  });
}
