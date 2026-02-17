// 一意のIDを生成するユーティリティ関数

/**
 * 一意のIDを生成します
 * @returns 一意のID文字列
 */
export const generateUniqueId = (): string => {
  return crypto.randomUUID();
};

