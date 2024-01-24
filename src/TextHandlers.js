// 此文件移植自https://github.com/laorange/paper-assistant/blob/master/src/assets/ts/article-copy-tool/handlers.ts
// 文本处理的方法

export {
    textHandlers
}

const textHandlers = {
    transferEnglishPunctuationToChinese: {
        default: false, /** 默认打开/关闭 */
        activate: false,
        description: "将英文标点转换为中文标点",
        executor: text => {
            const punctuationTuples = [
                [/'([\s\S]+?)'/g, "‘$1’"],
                [/"([\s\S]+?)"/g, "“$1”"],
                [",", "，"],
                [/\.(\D)/g, "。$1"], /** `\D`:避免是小数点 */
                [":", "："],
                [";", "；"],
                ["[", "【"],
                ["]", "】"],
                ["?", "？"],
                ["(", "（"],
                [")", "）"],
                ["!", "！"],
            ];
            return punctuationTuples.reduce((t, tuple) => t.replaceAll(tuple[0], tuple[1]), text);
        },
    },
    transferChinesePunctuationToEnglish: {
        default: false, /** 默认打开/关闭 */
        activate: false,
        description: "将中文标点转换为英文标点",
        executor: text => {
            const punctuationTuples = [
                [/[‘’]/g, "'"],
                [/[“”]/g, "\""],
                ["，", ","],
                ["。", "."],
                ["：", ":"],
                ["；", ";"],
                ["【", "["],
                ["】", "]"],
                ["？", "?"],
                ["（", "("],
                ["）", ")"],
                ["！", "!"],
            ];
            return punctuationTuples.reduce((t, tuple) => t.replaceAll(tuple[0], tuple[1]), text);
        },
    },
    /** 全角转半角, 参考：
     * 1. https://www.cnblogs.com/html55/p/10298569.html
     * 2. https://unicode-table.com/cn/search/?q=%E5%85%A8%E5%BD%A2%E6%95%B0%E5%AD%97 */
    convertFullWidthCharactersToHalfWidth: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "全角字符转半角字符",
        executor: (text) => {
            let result = "";
            for (let i = 0; i < text.length; i++) {
                let char = text.charCodeAt(i);
                // 中文空格替换为英文空格
                if (char == 12288) {
                    result += String.fromCharCode(char - 12256);
                    continue;
                }
                if (char > 65280 && char < 65375
                    // 对，：；·！#￥%…这样的全角字符不做转换
                    && [..."，：；·！#￥%…"].indexOf(text[i]) === -1) {
                    console.log([..."，：；·！#￥%…"].indexOf(text[i]));
                    result += String.fromCharCode(char - 65248);
                }
                else
                    result += String.fromCharCode(text.charCodeAt(i));
            }
            return result;
        },
    },
    deleteMultipleNewlines: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "删除重复的换行符",
        executor: (text) => text.replaceAll(/[\f\r\t\n]+/g, "\n"),
    },
    /** 替换换行符为空格 (参考：https://blog.csdn.net/lfod1997/article/details/121095287) */
    replaceNewlinesWithSpaces: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "将换行符替换为空格",
        executor: (text) => text.replaceAll(/[\f\r\t\n]/g, " "),
    },
    replaceMultipleSpacesWithASingleSpace: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "删除重复的空格",
        executor: (text) => text.replaceAll(/ +/g, " "),
    },
    removeSpacesBetweenNonEnglishLetters: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "删除非英文字母间的空格",
        executor: (text) => text
            .replaceAll(/([^A-Za-z"':]) +/g, "$1")
            .replaceAll(/ +([^A-Za-z"':])/g, "$1"),
    },
    addSpacesBetweenEnglishLettersAndNumbers: {
        default: false, /** 默认打开/关闭 */
        activate: false,
        description: "在字母与数字之间添加空格",
        executor: (text) => text
            .replaceAll(/(\d)([A-Za-z])/g, "$1 $2")
            .replaceAll(/([A-Za-z])(\d)/g, "$1 $2"),
    },
    addSpaceAfterEnglishPunctuation: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "在标点符号后添加空格",
        executor: (text) => text.replaceAll(/([,.?:;)])([^,.?:;)\s])/g, "$1 $2"),
    },
    deleteSpaceBetweenDotAndNumber: {
        default: true, /** 默认打开/关闭 */
        activate: true,
        description: "删除小数点和数字之间的空格",
        executor: (text) => text.replaceAll(/(\.)\s+(\d)/g, "$1$2"),
    },
    deleteSpaceBetweenColonAndNumber: {
        default: false, /** 默认打开/关闭 */
        activate: false,
        description: "删除冒号和数字之间的空格",
        executor: (text) => text.replaceAll(/(:)\s+(\d)/g, "$1$2"),
    },
};