export interface getPhotosByUsernameInterface {
  user: {
    edge_owner_to_timeline_media: {
      count: number;
      page_info: {
        has_next_page: boolean;
        end_cursor: string;
      };
      edges: {
        node: {
          __typename: "GraphImage" | "GraphVideo" | "GraphSidecar";
          id: number;
          dimensions: {
            height: number;
            width: number;
          };
          display_url: string;
          display_resources: {
            src: string;
            config_width: number;
            config_height: number;
          }[];
          is_video: boolean;
          should_log_client_event: boolean;
          tracking_token: boolean;
          edge_media_to_tagged_user: {
            edges: any[];
          };
          dash_info?: {
            is_dash_eligible: boolean;
            video_dash_manifest: any;
            number_of_qualities: number;
          };
          video_url?: string;
          video_view_count?: number;
          edge_media_to_caption: {
            edges: any[];
          };
          shortcode: string;
          edge_media_to_comment: {
            count: number;
            page_info: {
              has_next_page: boolean;
              end_cursor: string;
            };
            edges: any[];
          };
          comments_disabled: boolean;
          taken_at_timestamp: number;
          edge_media_preview_like: {
            count: number;
          };
          gating_info: any;
          media_preview: string;
          owner: {
            id: string;
          };
          thumbnail_src: string;
          thumbnail_resources: {
            src: string;
            config_width: number;
            config_height: number;
          }[];
          edge_sidecar_to_children?: {
            edges: {
              node: {
                __typename: "GraphImage" | "GraphVideo";
                id: number;
                dimensions: {
                  height: number;
                  width: number;
                };
                display_url: string;
                display_resources: {
                  src: string;
                  config_width: number;
                  config_height: number;
                }[];
                is_video: boolean;
                should_log_client_event: boolean;
                tracking_token: boolean;
                edge_media_to_tagged_user: {
                  edges: any[];
                };
              };
            }[];
          };
        };
      }[];
    };
  };
}
