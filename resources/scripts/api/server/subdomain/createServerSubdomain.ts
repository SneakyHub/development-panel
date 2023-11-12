import http from '@/api/http';

export default (uuid: string, subdomain?: string, domainId?: number, protocol?: string, protocolType?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/servers/${uuid}/subdomain/create`, {
            subdomain, domainId, protocol, protocolType,
        }).then((data) => {
            resolve(data.data || []);
        }).catch(reject);
    });
};
