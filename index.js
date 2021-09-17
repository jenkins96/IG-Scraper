const request = require('request-promise');
const cheerio = require('cheerio');

(async () => {

    const USERNAME = 'leomessi';
    const BASE_URL = `https://instagram.com/${ USERNAME }`;

    let response = await request(BASE_URL);

    let $ = cheerio.load(response);

    let script = $('script[type="text/javascript"]').eq(3).html();

    let script_regex = /window._sharedData = (.+);/g.exec(script);

    let { entry_data: { ProfilePage : {[0] : { graphql: { user } }  } } } = JSON.parse(script_regex[1]);

    let ig_data = {
        fullName: user.full_name,
        username: user.username,
        biography: user.biography,
        followersQty: user.edge_followed_by.count,
        isBusinessAccount: user.is_business_account,
        postsQty: user.edge_owner_to_timeline_media.count
    };
    console.log(ig_data);
})()

