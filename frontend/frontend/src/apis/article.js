import axios from 'axios';

export async function getOpenAlexInfo(workId) {
    try {
        const response = await axios.get(`https://api.openalex.org/works/${workId}?select=title`,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log('获取文献失败', error);
        return null;
    }
}

export async function getOpenAlexArticle(workId) {
    try {
        const response = await axios.get(`https://api.openalex.org/works/${workId}`,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log('获取文献失败', error);
        return null;
    }
}
