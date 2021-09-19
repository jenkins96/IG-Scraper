const request = require('request-promise');
const cheerio = require('cheerio');

(async () => {
    try{

    const USERNAME = 'leomessi';
    const BASE_URL = `https://instagram.com/${ USERNAME }`;

    let response = await request(BASE_URL);

    let $ = cheerio.load(response);

    let script = $('script[type="text/javascript"]').eq(3).html();

    let script_regex = /window._sharedData = (.+);/g.exec(script);


    let { entry_data: { ProfilePage : { [0] : { graphql: { user } } } } } = JSON.parse(script_regex[1]);

    let ig_data = {
        fullName: user.full_name,
        username: user.username,
        biography: user.biography,
        followersQty: user.edge_followed_by.count,
        isBusinessAccount: user.is_business_account,
        postsQty: user.edge_owner_to_timeline_media.count
    };

    let { entry_data: { ProfilePage : {[0] : { graphql: { user : { edge_owner_to_timeline_media } } }  } } } = JSON.parse(script_regex[1]);

    const posts = [];
    for(elem of edge_owner_to_timeline_media.edges){
     posts.push({  
        id: elem.node.id,
        caption: elem.node.text,
        is_video: elem.node.is_video,
        accessCaption: elem.node.accessibility_caption,
        commentQty: elem.node.edge_media_to_comment.count,
        timestamp: elem.node.taken_at_timestamp,
        liksQty: elem.node.edge_liked_by.count
    })
}
    console.log(posts);
    } catch(err){
     return   console.log(err);
    }
})()

