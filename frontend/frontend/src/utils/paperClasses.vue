<script lang="ts">
import { removeHtml } from '@/utils/stringProcessor';

export class AuthorInfo {
    public name: string;
    public id: string;
    public sup: number;

    public constructor(name: string, id: string, sup: number) {
        this.name = name;
        this.id = id;
        this.sup = sup;
    }
}

export class SchoolInfo {
    public name: string;
    public id: string;
    public sup: number;

    public constructor(name: string, id: string, sup: number) {
        this.name = name;
        this.id = id;
        this.sup = sup;
    }
}

export class Label{
    public name: string;
    public id: string;

    public constructor(name: string, id: string){
        this.name = name;
        this.id = id;
    }
}

export class PaperInfo {
    public title: string;   // name
    public ori_title: string;
    public doi: string;   // doi
    public id: string;   // documentId
    public year: Date;   // publishTime
    public authors: AuthorInfo[] = [];  // [{author_id: 0, author_name: "lrl", school_id: 0}] school_id和下面的对应 现在尚未有
    public schools: SchoolInfo[] = [];  // [{school_id: 0, school_name: "bh"}] 机构信息 现在尚未有
    public abstract: String;   // abstractPart
    public cite_num: number;   // citiationCount
    public type: string;   // 获奖，论文... 现在尚未有
    public journal: string;   // journal
    public journal_type: number;
    public labels: Label[] = [];   //keyWord
    public url: string;   // url
    public rank: number;

    public constructor(json, realQuery?: string, search_all?: boolean) {
        this.rank = json['_score'];
        json = json['_source'];
        this.title = declineString(json['title'], 150, realQuery);
        this.ori_title = json['title'];
        this.year = this.parseDate(json['publishTime']);
        this.parseSchools(json['institutionDTOS'], realQuery, search_all);
        this.parseAuthors(json['authorDTOS'], realQuery, search_all);
        this.abstract = declineString(json['abstracts'], 280, realQuery);
        this.cite_num = this.null2Number(json['cited']);
        this.journal = this.parseJournal(json['sources']);
        this.labels = this.parseLabel(json['conceptDTOS']);
        this.type = this.null2String(json['type']);
        this.doi = this.null2String(json['doi']);
        this.id = this.null2String(json['workId']);
    }

    private null2Number(json): number {
        if (!json) {
            return 0;
        }
        return json;
    }

    private null2String(json): string {
        if (!json) {
            return "";
        }
        return json;
    }

    private parseLabel(json): Label[] {
        if (!json) {
            return [];
        }
        let tmp = [];
        for (let each of json) {
            if (each.conceptLevel < 2) {
                tmp.push(new Label(each.conceptName, each.conceptId));
            }
        }
        return tmp;
    }

    private parseJournal(json): string {
        if (json && json.length > 0) {
            return json[0].name;
        }
        return "";
    }

    private parseAuthors(authors: [], realQuery?: string, search_all?: boolean) {
        let count = 0;
        for (let author of authors) {
            count++;
            if(count == 10){
                break;
            }
            let name: string = author['authorName'];
            name = removeHtml(name);
            if (realQuery) {
                if(search_all){
                    name = highlightedText(name, realQuery);
                }
            }
            this.authors.push(new AuthorInfo(name, author['authorId'], 1));
        }
    }

    private parseSchools(schools: [], realQuery?: string, search_all?: boolean) {
        let count = 0;
        for (let i = 0; i < schools.length; i++) {
            count++;
            if(count == 10){
                break;
            }
            let school = schools[i];
            let name: string = school['institutionName'];
            name = removeHtml(name);
            if (realQuery) {
                if(search_all){
                    name = highlightedText(name, realQuery);
                }
            }
            this.schools.push(new SchoolInfo(name, school['institutionId'], i + 1));
        }
    }

    private parseDate(date: string): Date {
        if (!date) {
            return new Date();
        }
        return new Date(date.replace(" ", "T"));
    }
}

function declineString(str: string, length: number, realQuery?: string): string {
    if (!str) {
        return "";
    }
    str = removeHtml(str);
    let tmp = str.length > length ? str.substring(0, length) + '...' : str;
    if (realQuery) {
        return highlightedText(tmp, realQuery);
    }
    else {
        return tmp;
    }
}

function highlightedText(text: string, keyword: string) {
    let keywords: string[] = keyword.split(/\s+/);
    const escapedKeywords = keywords.map((kw) =>
        kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    );
    const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
    return text.replace(regex, '<span style="color: red;">$1</span>');
}

export class Tag {
    public name: string;
    public isChoosed: boolean;

    constructor(name: string) {
        this.name = name;
        this.isChoosed = false;
    }
}

export class Query4Work {
    public static title_ab_fields = ['title', 'abstracts'];
    public static title_fields = ['title'];
    public static author_fields = ['authorDTOS.authorName'];
    public static all_fields = ['title', 'abstracts', 'authorDTOS.authorName', 'institutionDTOS.institutionName'];
    public static default_fields = ['title'];
    public static id_fields = ['workId'];
    public static type_fields = ['type'];
    public static authorId_fields = ['authorDTOS.authorId'];

    private fields: string[];
    private query: string;
    private accurate: string;

    constructor(fields: string[], query: string, accurate?: string) {
        this.fields = fields;
        this.query = query;
        this.accurate = accurate;
    }

    public toJson() {
        if (this.accurate) {
            if (this.accurate == "精确") {
                return {
                    multi_match: {
                        query: this.query,
                        fields: this.fields,
                        type: "phrase"
                    }
                }
            }
            else {
                return {
                    multi_match: {
                        query: this.query,
                        fields: this.fields,
                        fuzziness: 2
                    }
                }
            }
        }
        else if (this.fields == Query4Work.id_fields || this.fields == Query4Work.type_fields
            || this.fields == Query4Work.authorId_fields) {
            return {
                query_string: {
                    query: this.query,
                    fields: this.fields,
                    type: "phrase"
                }
            }
        }
        else if (this.fields == Query4Work.default_fields || this.fields == Query4Work.author_fields || this.fields == Query4Work.all_fields) {
            return {
                multi_match: {
                    query: this.query,
                    fields: this.fields,
                    type: "phrase"
                }
            }
        }
        else {
            return {
                multi_match: {
                    query: this.query,
                    fields: this.fields,
                    fuzziness: 2
                }
            }
        }
    }
}

export class Query4Author {
    public static id_fields = ['id'];
    public static name_fields = ['name'];

    private fields: string[];
    private query: string;

    constructor(fields: string[], query: string) {
        this.fields = fields;
        this.query = query;
    }

    public toJson() {
        if (this.fields == Query4Author.id_fields || this.fields == Query4Author.name_fields) {
            return {
                query_string: {
                    query: this.query,
                    fields: this.fields
                }
            }
        } else {
            return {
                multi_match: {
                    query: this.query,
                    fields: this.fields,
                    fuzziness: 2
                }
            }
        }
    }
}

import {defineComponent} from 'vue'

export default defineComponent({
  name: 'PaperClasses',
  // 组件的逻辑代码
});
</script>