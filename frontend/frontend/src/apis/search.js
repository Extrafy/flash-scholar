import axios from 'axios';

// 创建 axios 实例
const httpInstance = axios.create({
    baseURL: 'http://120.46.63.223:30021',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
    timeout: 20000,
});

export async function postTime(data) {
    try {
        const response = await httpInstance.post(
            "/api/time/add",
            data,
        );
        return response;
    }
    catch (error) {
        console.log(error);
    }
}

export async function searchWorks(json) {
    const url = 'http://120.46.63.223:9200/works/_search';

    const requestBody = {
        query: {
            bool: json
        },
        size: 5,
    };
    try {
        // let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        // const redisRes = await axios.post(redisQuery, {
        //     key: JSON.stringify(json)
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json;charset=UTF-8',
        //     },
        // })
        // console.log("缓存", redisRes.data);
        // if(redisRes.data.data){
        //     return JSON.parse(redisRes.data.data);
        // }

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        // console.log('Search Results:', response.data);
        // const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        // const setRes = await axios.post(redisUrl, {
        //     key: JSON.stringify(json),
        //     value: JSON.stringify(response.data)
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json;charset=UTF-8',
        //     },
        // })
        // console.log(setRes.data);
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchWorksQuick(json, start, sort) {
    const requestBody = {
        query: {
            bool: json
        },
        from: start,
        size: 5,
    };
    if (sort == 4) {
        requestBody['sort'] = [
            {
                "publishTime": { // 改字段名 按" "排序
                    "order": "asc" // 升序 desc 降序
                }
            }
        ]
    }
    else if (sort == 3) {
        requestBody['sort'] = [
            {
                "publishTime": {
                    "order": "desc"
                }
            }
        ]
    }
    else if (sort == 2) {
        requestBody['sort'] = [
            {
                "cited": { // 改字段名 按" "排序
                    "order": "asc" // 升序 desc 降序
                }
            }
        ]
    }
    else if (sort == 1) {
        requestBody['sort'] = [
            {
                "cited": {
                    "order": "desc"
                }
            }
        ]
    }


    try {
        let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        const redisRes = await axios.post(redisQuery, {
            key: JSON.stringify(requestBody) + "&_&" + start
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        if(redisRes.data.data[0]){
            let tmp = JSON.parse(redisRes.data.data[0]);
            let took = parseInt(redisRes.data.data[1]);
            tmp.took = took;
            return tmp;
        }
        
        const url = 'http://120.46.63.223:9200/works/_search';
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        const setRes = await axios.post(redisUrl, {
            key: JSON.stringify(requestBody) + "&_&" + start,
            value: JSON.stringify(response.data)
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchAuthors(name) {
    const url = 'http://120.46.63.223:9200/authors/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: name,
                            fields: ['name'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 10,
    };

    try {
        // let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        // const redisRes = await axios.post(redisQuery, {
        //     key: JSON.stringify(requestBody)
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json;charset=UTF-8',
        //     },
        // })
        // console.log("缓存", redisRes.data);
        // if(redisRes.data.data){
        //     return JSON.parse(redisRes.data.data);
        // }

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        // console.log('Search Results:', response.data);
        // const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        // const setRes = await axios.post(redisUrl, {
        //     key: JSON.stringify(requestBody),
        //     value: JSON.stringify(response.data)
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json;charset=UTF-8',
        //     },
        // })
        // console.log(setRes.data);
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}


export async function alexWorks(authorId) {
    const url = `https://api.openalex.org/works?filter=author.id:${authorId}`;
    try {
        let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        const redisRes = await axios.post(redisQuery, {
            key: url
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        if(redisRes.data.data[0]){
            return JSON.parse(redisRes.data.data[0]);
        }

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        const setRes = await axios.post(redisUrl, {
            key: url,
            value: JSON.stringify(response.data)
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Error while searching works:', error);
        return null;
    }
}

export async function alexWorksFast(authorId) {
    const url = `https://api.openalex.org/works?filter=author.id:${authorId}&select=authorships,cited_by_count,concepts,display_name,doi,id,locations,locations_count,publication_year,title,type`;
    try {
        let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        const redisRes = await axios.post(redisQuery, {
            key: url
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        if(redisRes.data.data[0]){
            return JSON.parse(redisRes.data.data[0]);
        }

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        const setRes = await axios.post(redisUrl, {
            key: url,
            value: JSON.stringify(response.data)
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Error while searching works:', error);
        return null;
    }
}

export async function alexAuthor(authorId) {
    const url = `https://api.openalex.org/authors/${authorId}`;
    try {
        let redisQuery = 'http://120.46.63.223:30017/api/redis/get';
        const redisRes = await axios.post(redisQuery, {
            key: url
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        if(redisRes.data.data[0]){
            return JSON.parse(redisRes.data.data[0]);
        }

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        const redisUrl = 'http://120.46.63.223:30017/api/redis/set';
        const setRes = await axios.post(redisUrl, {
            key: url,
            value: JSON.stringify(response.data)
        }, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        return response.data;
    } catch (error) {
        console.error('Error while searching works:', error);
        return null;
    }
}

export async function searchInstitutions(id) {
    const url = 'http://120.46.63.223:9200/institutions/_search';
    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: id,
                            fields: ['id'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 10,
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function changeWorkAuthor(work_id, author_name, author_id) {
    const url = 'http://120.46.63.223:9200/works/_search';
    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: work_id,
                            fields: ['workId'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 10,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        let work = response.data.hits.hits[0];
        if (work) {
            let body = work._source;
            for (let author of body.authorDTOS) {
                if (author.authorName == author_name) {
                    author.authorId = author_id;
                }
            }
            const changeUrl = 'http://120.46.63.223:9200/works/_doc/' + work_id;
            const res = await axios.post(changeUrl, body, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            })
        }
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchAuthorsFromIns(ins_id) {
    const url = 'http://120.46.63.223:9200/authors/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: ins_id,
                            fields: ['organization_id'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        sort: [
            {
                "cited": {
                    "order": "desc"
                }
            }
        ],
        size: 24,
    };

    try {

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function getRandomWork() {
    const url = 'http://120.46.63.223:9200/works/_search';

    const requestBody = {
        "query": {
          "function_score": {
            "query": { 
                "bool":{
                    "must":[
                        {
                            "range": {
                                "publishTime":{
                                    "gte":"2024-01-01",
                                    "lte":"2024-12-31"
                                },
                    
                            }
                         }
                         ,
                         {
                            "range":{
                                "cited":{
                                    "gte":100
                                }
                            }
                         },
                         {
                            "exists": {
                                "field":"abstracts"
                            }
                         },
                         {
                            "exists": {
                                "field":"authorDTOS"
                            }
                         }
                         
                    ]
                }
                
             },
            "random_score": {}
          }
        },
        "size": 10
      };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function getWorksFromAuthorName(authorName) {
    const url = 'http://120.46.63.223:9200/works/_search';
    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: authorName,
                            fields: ['authorDTOS.authorName'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 100,
    };
    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        let works = [];
        if(response.data){
            for(let work of response.data.hits.hits){
                let body = work._source;
                for (let author of body.authorDTOS) {
                    if (author.authorName == authorName) {
                        works.push(work);
                        break;
                    }
                }
            }
        }
        return works;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchWorksByAuthorId(id) {
    const url = 'http://120.46.63.223:9200/works/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: id,
                            fields: ['authorDTOS.authorId'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 100,
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        let works = [];
        if(response.data){
            for(let work of response.data.hits.hits){
                let body = work._source;
                works.push(parseWork2Alex(body));
            }
        }
        return works;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

function parseWork2Alex(body){
    return {
        "id": body.workId,
        "doi": body.doi,
        "publication_year": body.publishTime.split('-')[0],
        "authorships": parseAuthorships(body.authorDTOS),
        "title": body.title,
        "display_name": body.title,
        "concepts": parseConcepts(body.conceptDTOS),
        "cited_by_count": body.cited,
        "type": body.type,
        "locations_count": body.sources.length,
        "locations": parseLocations(body.sources),
    }
}

function parseLocations(sources){
    let locations = [];
    if(!sources){
        return null;
    }
    for(let source of sources){
        if(!source.name){
            locations.push({
                "is_oa": source.isOa,
                "landing_page_url": source.url,
                "pdf_url": source.pdf_url,
                "source": null
            });
        }
        else{
            locations.push({
                "is_oa": source.isOa,
                "landing_page_url": source.url,
                "pdf_url": source.pdf_url,
                "source": {
                    "id": source.id,
                    "display_name": source.name,
                    "is_oa": source.isOa,
                }
            })
        }

    }
    return locations;
}

function parseConcepts(conceptDTOS){
    let concepts = [];
    for(let concept of conceptDTOS){
        concepts.push({
            "id": concept.conceptId,
            "display_name": concept.conceptName,
            "level": concept.conceptLevel,
            "score": 0,
            "wikidata": "",
        })
    }
    return concepts;
}

function parseAuthorships(authorDTOS){
    let authorships = [];
    for(let author of authorDTOS){
        authorships.push({
            "author": {
                "id": author.authorId,
                "display_name": author.authorName,
            },
            "institutions": [],
            "raw_affiliation_strings": [],
            "affiliations": [],
        })
    }
    return authorships;
}

export async function searchWorksByConcepts(c_id, from, size) {
    const url = 'http://120.46.63.223:9200/works/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: c_id,
                            fields: ['conceptDTOS.conceptId'],
                        }
                    }
                ]
            }
        },
        from: from,
        size: size,
    };
    requestBody['sort'] = [
        {
            "cited": {
                "order": "desc"
            }
        }
    ]

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchConceptById(c_id) {
    const url = 'http://120.46.63.223:9200/concepts/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: c_id,
                            fields: ['id'],
                        }
                    }
                ]
            }
        },
        size: 10,
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function getAuthorInfo(id) {
    const url = 'http://120.46.63.223:9200/authors/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: id,
                            fields: ['id'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 10,
    };

    try {

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}

export async function searchWorksByTitle(title) {
    const url = 'http://120.46.63.223:9200/works/_search';

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: title,
                            fields: ['title'],
                            type: "phrase"
                        }
                    }
                ]
            }
        },
        size: 10,
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Error while searching users:', error);
        return null;
    }
}