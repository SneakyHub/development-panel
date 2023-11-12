import http from '@/api/http';

export default (uuid: string, cloudflareEmail?: string, cloudflareApikey?: string, domain?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/servers/${uuid}/subdomain/save`, {
            cloudflareEmail, cloudflareApikey, domain,
        }).then((data) => {
            resolve(data.data || []);
        }).catch(reject);
    });
};
