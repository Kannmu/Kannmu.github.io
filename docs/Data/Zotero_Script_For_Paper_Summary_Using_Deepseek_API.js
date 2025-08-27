// =================================================================
// == Zotero DeepSeek Automation: Abstract & Summary Generator  ==
// == Author: Kannmu                                            ==
// == Version: 3.2 (Pre-flight Checks & Efficiency Update)      ==
// == Zotero Version: 7+                                        ==
// =================================================================

// --- 1. 配置区域 (请务必为 DeepSeek 修改) ---
const config = {
    // ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    // ！！ ==> 在这里填入您从 DeepSeek 平台获取的 API Key <== ！！
    // ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    DEEPSEEK_API_KEY: "sk-xxxxxxxxxxxxxx",

    // DeepSeek API Endpoint (通常无需修改)
    CHAT_COMPLETION_URL: "https://api.deepseek.com/chat/completions",

    // 使用的模型 (推荐使用 deepseek-chat)
    MODEL: "deepseek-chat",

    // 用于提取摘要的文本片段长度 (字符数)
    ABSTRACT_SNIPPET_LENGTH: 4000,
    
    // 用于识别脚本生成笔记的标题
    NOTE_TITLE: "Paper Summary: "
};

// --- 2. Prompt 指令工程 (通用，无需修改) ---
const prompts = {
    extractAbstract: (textSnippet) => ({
        model: config.MODEL,
        messages: [
            { role: "system", content: "You are a highly skilled academic assistant. Your task is to accurately extract the 'Abstract' section from the beginning of a research paper. Respond with ONLY the full, verbatim text of the abstract. Do not add any introductory phrases like 'The abstract is:' or any concluding remarks." },
            { role: "user", content: `Please extract the abstract from the following text:\n\n---\n\n${textSnippet}` }
        ],
        temperature: 0.0,
    }),
    summarizeFullText: (fullText) => ({
        model: config.MODEL,
        messages: [
            { role: "system", content: "You are a professional academic summarizer. Your task is to read the entire research paper provided by the user. For each paragraph of the paper, you will generate a concise,yet, informative summary. Only summarize chapters that contain information relevant to the study of this paper(ignore chapters like Acknowledgements, References, etc). Your summary need to contains enough information about this paper that are useful for writing a high-quality review and as detailed as possible. After summarizing all paragraphs, you must combine all these individual summaries into a SINGLE, CONTINUOUS, and very very long paragraph written in formal academic English. The final output must NOT contain any line breaks or newlines (no \\n). It should be one seamless block of text."},
            { role: "user", content: `Please process the following research paper according to the instructions and provide the single-paragraph summary:\n\n---\n\n${fullText}` }
        ],
        temperature: 0.6,
    }),
};


// --- 3. 核心执行逻辑 ---
async function main() {
    Zotero.debug("[DeepSeekScript] v3.2 Started.");
    
    if (!config.DEEPSEEK_API_KEY || config.DEEPSEEK_API_KEY.includes("sk-xxx")) {
        showStatus("错误：请先在脚本中配置您的 DEEPSEEK_API_KEY。", "error");
        return;
    }

    const selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
    if (!selectedItems || selectedItems.length === 0) {
        showStatus("未检测到任何选中的条目，脚本结束。", "warn");
        return;
    }

    let processedCount = 0;
    for (const [index, item] of selectedItems.entries()) {
        const title = item.getField('title') || 'Untitled';
        const itemIdentifier = `[${index + 1}/${selectedItems.length}] "${title}"`;
        Zotero.debug(`\n--- Checking Item ${itemIdentifier} ---`);

        if (!item.isRegularItem()) continue;

        // 检查点 1: 必须有PDF附件
        const attachment = await getPDF(item);
        if (!attachment) {
            Zotero.debug(`[SKIP] No PDF attachment found.`);
            continue;
        }

        // 检查点 2: 不能已存在AI总结笔记
        if (await hasExistingNote(item, config.NOTE_TITLE)) {
            Zotero.debug(`[SKIP] An AI summary note already exists.`);
            continue;
        }
        
        // 所有检查通过，开始处理
        Zotero.debug(`[PROCESS] Pre-flight checks passed. Starting main process...`);
        processedCount++;
        try {
            showStatus(`${itemIdentifier}\n正在处理...`);
            
            // 1. 提取本地文本
            const fullText = await attachment.attachmentText;
            if (!fullText || fullText.trim().length === 0) {
                throw new Error("Zotero 未能从此 PDF 提取文本。它可能是图片扫描件，请先进行 OCR。");
            }
            Zotero.debug(`Extracted ${fullText.length} characters of text locally.`);

            // 2. 检查并提取摘要
            const existingAbstract = item.getField('abstractNote');
            if (!existingAbstract || existingAbstract.trim() === '') {
                showStatus(`${itemIdentifier}\n摘要为空，正在调用 DeepSeek 提取...`);
                Zotero.debug(`Abstract field is empty. Calling API to extract abstract.`);
                const abstractText = await callDeepSeekAPI('extractAbstract', fullText.substring(0, config.ABSTRACT_SNIPPET_LENGTH));
                item.setField('abstractNote', abstractText);
                await item.saveTx();
                Zotero.debug(`Abstract field updated.`);
            } else {
                Zotero.debug(`Skipping abstract extraction as it already exists.`);
            }

            // 3. 生成全文总结并创建笔记
            showStatus(`${itemIdentifier}\n正在调用 DeepSeek 生成全文总结...`);
            Zotero.debug(`Calling API to summarize full text.`);
            const summaryText = await callDeepSeekAPI('summarizeFullText', fullText);
            await createNote(item, config.NOTE_TITLE, summaryText);
            
            showStatus(`${itemIdentifier}\n处理成功！`, "success");

        } catch (error) {
            const errorMessage = `处理 "${title}" 时发生错误:\n${error.message}`;
            showStatus(errorMessage, "error", 15000);
            Zotero.debug(`[DeepSeekScript] ERROR on item "${title}": ${error.stack || error}`);
        }
    }
    
    showStatus(`处理完毕！\n共选中 ${selectedItems.length} 个条目，处理了 ${processedCount} 个。`, "success");
    Zotero.debug("[DeepSeekScript] v3.2 Finished.");
}

// --- 4. 辅助函数 ---

function showStatus(message, type = "info", timeout = 5000) {
    const progress = new Zotero.ProgressWindow();
    progress.changeHeadline("DeepSeek 自动化脚本");
    progress.addDescription(message);
    progress.show();
    progress.startCloseTimer(timeout);
}

async function getPDF(item) {
    const attachmentIDs = item.getAttachments();
    for (const id of attachmentIDs) {
        const attachment = await Zotero.Items.getAsync(id);
        if (attachment.attachmentContentType === 'application/pdf') {
            return attachment;
        }
    }
    return null;
}

async function hasExistingNote(parentItem, noteTitle) {
    const attachmentIDs = parentItem.getAttachments();
    for (const id of attachmentIDs) {
        const attachment = await Zotero.Items.getAsync(id);
        if (attachment.isNote()) {
            const noteContent = attachment.getNote();
            if (noteContent && noteContent.startsWith(noteTitle)) {
                return true;
            }
        }
    }
    return false;
}

function callDeepSeekAPI(promptType, text) {
    return new Zotero.Promise((resolve, reject) => {
        try {
            const bodyPayload = prompts[promptType](text);
            const bodyString = JSON.stringify(bodyPayload);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', config.CHAT_COMPLETION_URL, true);
            
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${config.DEEPSEEK_API_KEY}`);
            
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseData = JSON.parse(xhr.responseText);
                        if (responseData.choices && responseData.choices[0]?.message?.content) {
                            resolve(responseData.choices[0].message.content.trim());
                        } else {
                            reject(new Error("DeepSeek API 响应格式无效。"));
                        }
                    } catch (e) {
                        reject(new Error(`解析 DeepSeek 响应失败: ${e.message}`));
                    }
                } else {
                    reject(new Error(`DeepSeek API 请求失败。状态码: ${xhr.status}. 响应: ${xhr.responseText}`));
                }
            };

            xhr.onerror = function () { reject(new Error('网络错误，无法连接 DeepSeek API。')); };
            xhr.ontimeout = function () { reject(new Error('DeepSeek API 请求超时。')); };

            xhr.send(bodyString);
        } catch(e) {
            reject(e);
        }
    });
}

async function createNote(parentItem, title, content) {
    const note = new Zotero.Item('note');
    note.parentID = parentItem.id;
    const noteContent = `${title}\n\n${content}`;
    note.setNote(noteContent);
    await note.saveTx();
}

// --- 5. 启动脚本 ---
(async () => {
    try {
        await main();
    } catch (e) {
        const fatalMessage = `脚本发生致命错误: ${e.message}`;
        showStatus(fatalMessage, "error", 15000);
        Zotero.debug(`[DeepSeekScript] FATAL ERROR: ${e.stack || e}`);
    }
})();
