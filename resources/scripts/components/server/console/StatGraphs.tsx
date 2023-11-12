import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { hexToRgba } from '@/lib/helpers';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import { theme } from 'twin.macro';
import ChartBlock from '@/components/server/console/ChartBlock';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'rx' | 'tx', number>;

export default () => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MB');
    const disk = useChartTickLabel('Memory', limits.memory, 'MB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? theme('colors.cyan.400') : theme('colors.yellow.400'),
                backgroundColor: hexToRgba(!index ? theme('colors.cyan.700') : theme('colors.yellow.700'), 0.5),
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            disk.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        disk.push(Math.floor(values.disk_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
        });
    });

    const resourcesLimit = useMemo( () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : ``,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : ``,
        }),
        [limits]
    );

    return (
        <>
            <ChartBlock title={'CPU Load'}>
                    {status == 'offline' ?
                        <div css="width: 100%;height: 56px;padding: 0.5rem;text-align: center;padding: 0.75rem;background: var(--ptx-secondary);">
                            <p css="font-size: 0.75rem;line-height: 1rem;"><b>Server is Offline</b></p>
                        </div>
                    :
                        <div css="width: 100%;text-align: right;padding: 5px;font-size: smaller;">
                            <p><b>{`${stats.cpu.toFixed(2)}%`}</b> / {`${resourcesLimit.cpu || 'Unlimited'}`}</p>
                            <Line {...cpu.props} />
                        </div>
                    }
            </ChartBlock>
            <ChartBlock title={'Memory'}>
                    {status == 'offline' ?
                        <div css="width: 100%;height: 56px;padding: 0.5rem;text-align: center;padding: 0.75rem;background: var(--ptx-secondary);">
                            <p css="font-size: 0.75rem;line-height: 1rem;"><b>Server is Offline</b></p>
                        </div>
                    :
                        <div css="width: 100%;text-align: right;padding: 5px;font-size: smaller;">
                            <p><b>{`${bytesToString(stats.memory)}`}</b> / {`${resourcesLimit.memory || 'Unlimited'}`}</p>
                            <Line {...memory.props} />
                        </div>
                    }
            </ChartBlock>
            <ChartBlock
                title={'Network'}
            >
                    {status == 'offline' ?
                        <div css="width: 100%;height: 56px;padding: 0.5rem;text-align: center;padding: 0.75rem;background: var(--ptx-secondary);">
                            <p css="font-size: 0.75rem;line-height: 1rem;"><b>Server is Offline</b></p>
                        </div>
                    :   
                        <div css="width: 100%;text-align: right;padding: 5px;font-size: smaller;">
                            <p><b>{`${bytesToString(stats.rx)}`}</b> / {`${bytesToString(stats.tx)}`}</p>
                            <Line {...network.props} />
                        </div>
                    }
            </ChartBlock>
        </>
    );
};
