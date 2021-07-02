import Dexie from 'dexie'

//typescriptの型定義
export interface MemoRecord {
    datetime: string
    title: string
    text: string
}

//dexieのインスタンス作成
const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' })
//総称型。memorecordはデータの型。stringはdatetimeの型。
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async(title: string, text: string): Promise<void> => {
    const datetime = new Date().toISOString()
    await memos.put({datetime, title, text})
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async(): Promise<number> => {
    const totalCount = await memos.count()
    const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
    return pageCount > 0 ? pageCount : 1
}

//テキスト履歴をリストで取得。戻り値は配列。
export const getMemos = (page: number): Promise<MemoRecord[]> => {
    const offset = (page - 1) * NUM_PER_PAGE
    return memos.orderBy('datetime')
                .reverse()
                .offset(offset)
                .limit(NUM_PER_PAGE)
                //データを配列に変換
                .toArray()
}