if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = require("./config/instagram-client");
const { config, write, download } = require("./config");
const { INSTAGRAM_USER_ID, INSTAGRAM_FIRST_MEDIA } = process.env;

async function bootstrap() {
  console.log("** BOT STARTING **");
  try {
    // * LOGIN
    await app.login();

    // * GET FIRST 50 PHOTOS
    const {
      user: {
        edge_owner_to_timeline_media: {
          count: total_media,
          edges: medias,
          page_info,
        },
      },
    } = await app.getUserIdPhotos({
      id: INSTAGRAM_USER_ID,
      first: parseInt(INSTAGRAM_FIRST_MEDIA),
    });

    // * SET DATA
    const data = {
      COUNT: 0,
      END_CURSOR: page_info.end_cursor,
      INDEX: 0,
    };

    // * CHECK DIFFERENCE FOR LAST POSITION
    if (config.latest_id === medias[0].node.id)
      return console.log("You already have all the medias, skipping");

    // * START THE BOT
    const result = [];
    const resultCreator = ({ node: { __typename, ...media } }) => {
      switch (__typename) {
        case "GraphImage":
          result.push({ ...media }.display_url);
          break;
        case "GraphVideo":
          result.push({ ...media }.video_url);
          break;
        case "GraphSidecar":
          result.push(
            ...{ ...media }.edge_sidecar_to_children.edges.map(({ node }) =>
              node.__typename === "GraphImage"
                ? node.display_url
                : node.video_url
            )
          );
          break;
      }
    };

    const current_id = medias
      .map(({ node: { id } }) => id)
      .findIndex((id) => id === config.latest_id);

    if (current_id !== -1) {
      for (let i = 0; i < current_id; i++) {
        resultCreator(medias[i]);
      }
      const final_result = [...result, ...config.medias];
      return write({
        latest_id: medias[0].node.id,
        medias: final_result,
      });

      // return download();
    }

    // * IF IN FIRST 50 PHOTOS CANNOT FOUND LAST POSITION
    write({ latest_id: "", medias: [] }); // ! -> PRUNE ALL

    medias.forEach((node) => resultCreator(node));

    while (data.COUNT !== total_media) {
      console.log(`** LOOP ${data.INDEX} **`);
      const new_count = data.COUNT + parseInt(INSTAGRAM_FIRST_MEDIA);
      data.COUNT =
        new_count <= total_media
          ? (data.config = new_count)
          : data.COUNT + Math.abs(total_media - data.COUNT);

      if (data.COUNT === total_media) break;
      const response = await app.getUserIdPhotos({
        id: INSTAGRAM_USER_ID,
        first: parseInt(INSTAGRAM_FIRST_MEDIA),
        after: data.END_CURSOR,
      });

      const new_response = response.user.edge_owner_to_timeline_media;
      data.END_CURSOR = new_response.page_info.end_cursor;

      new_response.edges.forEach((node) => resultCreator(node));

      console.log(`** Success saved ${result.length} data **`);
      data.INDEX++;
    }

    write({
      latest_id: medias[0].node.id,
      medias: result,
      latest_length: `${result.length - 1}`,
    });
    return download(result);
  } catch (error) {
    console.error("An Error Occurred, trying in next schedule");
  }
}

bootstrap();
