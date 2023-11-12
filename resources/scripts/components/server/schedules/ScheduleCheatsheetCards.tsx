import React from 'react';
import tw from 'twin.macro';

export default () => {
    return (
        <>
            <div css={tw`md:w-1/2 h-full border-[color:var(--ptx-border)] border-2 text-[color:var(--ptx-text)] mr-0.5`}>
                <div css={tw`flex flex-col`}>
                    <h2 css={tw`py-4 px-6 font-bold text-xl justify-center flex`}>Examples</h2>
                    <div css={tw`flex py-4 px-6 bg-[color:var(--ptx-primary)] text-base`}>
                        <div css={tw`w-1/2`}>*/5 * * * *</div>
                        <div css={tw`w-1/2`}>every 5 minutes</div>
                    </div>
                    <div css={tw`flex py-4 px-6 text-base`}>
                        <div css={tw`w-1/2`}>0 */1 * * *</div>
                        <div css={tw`w-1/2`}>every hour</div>
                    </div>
                    <div css={tw`flex py-4 px-6 bg-[color:var(--ptx-primary)] text-base`}>
                        <div css={tw`w-1/2`}>0 8-12 * * *</div>
                        <div css={tw`w-1/2`}>hour range</div>
                    </div>
                    <div css={tw`flex py-4 px-6 text-base`}>
                        <div css={tw`w-1/2`}>0 0 * * *</div>
                        <div css={tw`w-1/2`}>once a day</div>
                    </div>
                    <div css={tw`flex py-4 px-6 bg-[color:var(--ptx-primary)] text-base`}>
                        <div css={tw`w-1/2`}>0 0 * * MON</div>
                        <div css={tw`w-1/2`}>every Monday</div>
                    </div>
                </div>
            </div>
            <div css={tw`md:w-1/2 h-full border-[color:var(--ptx-border)] border-2 text-[color:var(--ptx-text)]ml-0.5`}>
                <h2 css={tw`py-4 px-6 font-bold text-xl justify-center flex`}>Special Characters</h2>
                <div css={tw`flex flex-col`}>
                    <div css={tw`flex py-4 px-6 bg-[color:var(--ptx-primary)] text-base`}>
                        <div css={tw`w-1/2`}>*</div>
                        <div css={tw`w-1/2`}>any value</div>
                    </div>
                    <div css={tw`flex py-4 px-6 text-base`}>
                        <div css={tw`w-1/2`}>,</div>
                        <div css={tw`w-1/2`}>value list separator</div>
                    </div>
                    <div css={tw`flex py-4 px-6 bg-[color:var(--ptx-primary)] text-base`}>
                        <div css={tw`w-1/2`}>-</div>
                        <div css={tw`w-1/2`}>range values</div>
                    </div>
                    <div css={tw`flex py-4 px-6 text-base`}>
                        <div css={tw`w-1/2`}>/</div>
                        <div css={tw`w-1/2`}>step values</div>
                    </div>
                </div>
            </div>
        </>
    );
};
