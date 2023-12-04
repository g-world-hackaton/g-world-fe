import { fetch } from './api';

export type GoodsInfo = {
  id: string;
  goodsName: string;
  goodsPhotoUrl: string;
  goodsPrice: number;
};

export const getGoods = async () => {
  try {
    const { data } = await fetch.get('/api/api/good/goods');
    return data;
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};

export const getFolders = async () => {
  try {
    const { data } = await fetch.get(
      '/api/api/magazine/folders?consumerId=consumer1',
    );
    return data;
  } catch (e) {
    console.error(e);
    return { success: false, data: [] };
  }
};
