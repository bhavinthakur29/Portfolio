import { useState, useEffect, useRef } from 'react';
import './Home.css';
import LetterGlitch from '../../components/LetterGlitch';
import garudaLogo from '../../assets/garuda-logo.png';
import commandsData from '../../data/commands.json';

export default function Home() {
    const [commandHistory, setCommandHistory] = useState([
        { type: 'welcome', content: null }
    ]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentTime, setCurrentTime] = useState('');
    const [ipAddress, setIpAddress] = useState('Fetching...');
    const inputRef = useRef(null);
    const terminalBodyRef = useRef(null);

    const commands = commandsData.commands;

    const getSystemInfo = () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const colorDepth = window.screen.colorDepth;
        const hardwareConcurrency = navigator.hardwareConcurrency || 'Unknown';
        const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown';

        // Detect OS
        let os = 'Unknown';
        if (userAgent.includes('Win')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

        // Detect Browser/Shell
        let browser = 'Unknown';
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Edg')) browser = 'Edge';
        else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

        // Get browser version if possible
        const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edg|OPR)\/(\d+)/);
        const browserVersion = browserMatch ? browserMatch[2] : '?';

        // Get OS architecture
        let arch = 'x86_64';
        if (platform.includes('Win64') || platform.includes('Linux x86_64') || userAgent.includes('x86_64')) {
            arch = 'x86_64';
        } else if (platform.includes('Win32') || userAgent.includes('WOW64')) {
            arch = 'x86_64';
        } else if (platform.includes('MacIntel')) {
            arch = 'x86_64';
        } else if (platform.includes('Linux')) {
            arch = 'x86_64';
        } else if (userAgent.includes('Android')) {
            arch = 'arm64';
        } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
            arch = 'arm64';
        }

        // Get GPU info
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        let gpu = 'Unknown';
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
            }
        }

        // Get network status
        const networkStatus = navigator.onLine ? 'Online' : 'Offline';

        // Get current time
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Try to get IP address (this will be async, so we'll show "Fetching..." initially)
        // For now, we'll use a placeholder or try to get it via a service

        // Get uptime (time since page load)
        const pageLoadTime = performance.timing ? performance.timing.navigationStart : Date.now();
        const uptimeMs = Date.now() - pageLoadTime;
        const uptimeMins = Math.floor(uptimeMs / 60000);
        const uptimeSecs = Math.floor((uptimeMs % 60000) / 1000);
        const uptime = uptimeMins > 0 ? `${uptimeMins} mins` : `${uptimeSecs} secs`;

        // Get battery info if available (will be async, so we'll handle it separately)
        // For now, we'll set it to a default and update it if available
        let battery = 'Unknown';
        // Note: Battery API is async, so we can't get it synchronously here
        // We'll need to handle it separately if needed

        return {
            os: `${os} ${arch}`,
            cpu: `${hardwareConcurrency} Cores`,
            gpu: gpu,
            memory: deviceMemory,
            shell: `${browser} ${browserVersion}`,
            uptime: uptime,
            battery: battery,
            resolution: `${screenWidth}x${screenHeight}`,
            host: window.location.hostname || 'localhost',
            user: 'root',
            currentDir: '~/home',
            time: `${dateString}, ${timeString}`,
            network: networkStatus,
            ipAddress: ipAddress,
            language: language,
            timezone: timezone
        };
    };

    const getFormattedOutput = (cmd, commandData, fullCommand) => {
        // Check if command has formattedData in JSON
        if (commandData.formattedData) {
            return commandData.formattedData;
        }

        // Check if command has help data in JSON
        if (commandData.help) {
            return commandData.help;
        }

        // Handle dynamic commands
        switch (cmd) {
            case 'sysinfo':
                return {
                    title: 'sysinfo',
                    neofetch: true,
                    systemInfo: getSystemInfo()
                };
            case 'echo':
                const echoText = fullCommand.replace(/^echo\s+/i, '');
                return {
                    title: '>_ Echo',
                    content: echoText || '(empty)'
                };
            default:
                return null;
        }
    };

    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [commandHistory]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            setCurrentTime(`${timezone} | ${dateString}, ${timeString}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fetch IP address on mount
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIpAddress(data.ip))
            .catch(() => setIpAddress('Unknown'));
    }, []);

    // Calculate Levenshtein distance between two strings
    const levenshteinDistance = (str1, str2) => {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // deletion
                        dp[i][j - 1] + 1,     // insertion
                        dp[i - 1][j - 1] + 1   // substitution
                    );
                }
            }
        }

        return dp[m][n];
    };

    // Find the closest matching command
    const findClosestCommand = (inputCmd) => {
        const availableCommands = Object.keys(commands);
        let minDistance = Infinity;
        let closestCommand = null;

        for (const cmd of availableCommands) {
            const distance = levenshteinDistance(inputCmd.toLowerCase(), cmd.toLowerCase());
            if (distance < minDistance) {
                minDistance = distance;
                closestCommand = cmd;
            }
        }

        // Consider it a close match if distance is <= 2 or if the input is a substring
        const maxLength = Math.max(inputCmd.length, closestCommand?.length || 0);
        const similarity = maxLength > 0 ? (maxLength - minDistance) / maxLength : 0;

        // Threshold: if similarity is >= 0.6 or distance <= 2, it's a close match
        if (closestCommand && (minDistance <= 2 || similarity >= 0.6)) {
            return { command: closestCommand, distance: minDistance };
        }

        return null;
    };

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        if (trimmedCmd === '') {
            setCommandHistory(prev => [...prev, { type: 'command', command: '', output: null }]);
            return;
        }

        // Handle commands with arguments
        const baseCmd = trimmedCmd.split(' ')[0];
        const commandData = commands[baseCmd];

        if (commandData) {
            // Handle special actions
            if (commandData.action === 'closeTab') {
                setCommandHistory(prev => [...prev, {
                    type: 'command',
                    command: cmd,
                    output: 'Closing terminal...',
                    formatted: false
                }]);
                // Close the tab after a short delay
                setTimeout(() => {
                    window.close();
                    // Fallback if window.close() doesn't work (some browsers block it)
                    if (!document.hidden) {
                        window.location.href = 'about:blank';
                    }
                }, 500);
                return;
            }

            if (commandData.clear) {
                setCommandHistory([{ type: 'welcome', content: null }]);
            } else if (commandData.formatted) {
                const formatted = getFormattedOutput(baseCmd, commandData, cmd);
                setCommandHistory(prev => [...prev, {
                    type: 'command',
                    command: cmd,
                    output: commandData.output,
                    formatted: formatted
                }]);
            } else {
                setCommandHistory(prev => [...prev, {
                    type: 'command',
                    command: cmd,
                    output: commandData.output,
                    formatted: false
                }]);
            }
        } else {
            // Find closest match
            const closestMatch = findClosestCommand(baseCmd);

            if (closestMatch) {
                // Show suggestion for close match
                setCommandHistory(prev => [...prev, {
                    type: 'command',
                    command: cmd,
                    output: `Command not found: ${cmd}`,
                    formatted: {
                        title: '>_ Command Not Found',
                        content: `Did you mean "${closestMatch.command}"?\n\nType "${closestMatch.command}" to execute it, or type "help" to see all available commands.`
                    }
                }]);
            } else {
                // Show help instructions for large mismatch
                const helpOutput = getFormattedOutput('help', commands.help, 'help');
                setCommandHistory(prev => [...prev, {
                    type: 'command',
                    command: cmd,
                    output: `Command not found: ${cmd}`,
                    formatted: {
                        title: '>_ Command Not Found',
                        content: `The command "${cmd}" was not found.\n\nTry \`help\` instead?`,
                        items: helpOutput.items,
                        footer: 'Type a command and hit Enter to execute'
                    }
                }]);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(currentCommand);
            setCurrentCommand('');
            setHistoryIndex(-1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commandEntries = commandHistory.filter(h => h.type === 'command' && h.command);
            if (commandEntries.length > 0) {
                const newIndex = historyIndex === -1 ? commandEntries.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentCommand(commandEntries[newIndex].command);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const commandEntries = commandHistory.filter(h => h.type === 'command' && h.command);
            if (historyIndex !== -1 && historyIndex < commandEntries.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCurrentCommand(commandEntries[newIndex].command);
            } else {
                setHistoryIndex(-1);
                setCurrentCommand('');
            }
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="terminal-header">
                    <div className="terminal-controls">
                        <span className="control close"></span>
                        <span className="control minimize"></span>
                        <span className="control maximize"></span>
                    </div>
                    <span className="terminal-title">𖤓</span>
                    <div className="terminal-clock">{currentTime}</div>
                </div>
                <div className="terminal-body">
                    <div className="terminal-body-scrollable" ref={terminalBodyRef}>
                        {commandHistory.map((item, index) => {
                            if (item.type === 'welcome') {
                                return (
                                    <div key={index} className="welcome-section">
                                        <div className="welcome-logo-container">
                                            <img
                                                src={garudaLogo}
                                                alt="Garuda Linux Logo"
                                                className="garuda-logo-welcome"
                                            />
                                        </div>
                                        <div className="terminal-title-large">PHOTRON</div>
                                        <div className="welcome-message">
                                            Greetings from Photron!
                                        </div>
                                        <div className="welcome-instruction">
                                            Type <span className="command-hint">about</span> or <span className="command-hint">help</span> to begin.
                                        </div>
                                        <a
                                            href="https://github.com/bhavinthakur29"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="welcome-github-btn"
                                        >
                                            GitHub Profile
                                        </a>
                                    </div>
                                );
                            }
                            if (item.type === 'neofetch') {
                                return (
                                    <div key={index} className="neofetch-container">
                                        <div className="neofetch-left">
                                            <img
                                                src={garudaLogo}
                                                alt="Garuda Linux Logo"
                                                className="garuda-logo"
                                            />
                                        </div>
                                        <div className="neofetch-right">
                                            <div className="neofetch-user">
                                                <span className="neofetch-label">root</span>@<span className="neofetch-label">photron</span>
                                            </div>
                                            <div className="neofetch-info">
                                                <div className="info-line">
                                                    <span className="info-label">OS:</span> <span className="info-value">Portfolio Linux x86_64</span>
                                                </div>
                                                <div className="info-line">
                                                    <span className="info-label">Host:</span> <span className="info-value">photron.pages.dev</span>
                                                </div>
                                                <div className="info-line">
                                                    <span className="info-label">Shell:</span> <span className="info-value">fish 3.6.1</span>
                                                </div>
                                                <div className="info-line">
                                                    <span className="info-label">Terminal:</span> <span className="info-value">konsole 23.8.2</span>
                                                </div>
                                                <div className="info-line">
                                                    <span className="info-label">Repos:</span> <span className="info-value">59</span>
                                                </div>
                                                <div className="info-line">
                                                    <span className="info-label">Location:</span> <span className="info-value">London, UK</span>
                                                </div>
                                            </div>
                                            <div className="color-palette">
                                                <span className="color-block" style={{ backgroundColor: '#1a1a1a' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#ff0000' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#00ff00' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#ffff00' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#0000ff' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#ff00ff' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#00ffff' }}></span>
                                                <span className="color-block" style={{ backgroundColor: '#ffffff' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="terminal-command-block">
                                    <div className="terminal-prompt-line">
                                        <span className="prompt-user">root</span>@<span className="prompt-host">photron</span>:<span className="prompt-dir">~</span>$ <span className="terminal-text">{item.command}</span>
                                    </div>
                                    {item.formatted ? (
                                        <div className={`terminal-output-box ${item.formatted.title && item.formatted.title.includes('Command Not Found') ? 'error-output' : ''}`}>
                                            {item.formatted.title && (
                                                <div className={`output-box-title ${item.formatted.title.includes('Command Not Found') ? 'error-title' : ''}`}>{item.formatted.title}</div>
                                            )}
                                            {item.formatted.neofetch && (
                                                <div className="sysinfo-container">
                                                    <div className="sysinfo-header">
                                                        <span className="sysinfo-title">SYSTEM INFORMATION</span>
                                                    </div>
                                                    <div className="sysinfo-content">
                                                        <div className="sysinfo-section">
                                                            <div className="sysinfo-category">SYSTEM</div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">OS:</span>
                                                                <span className="info-value sysinfo-value sysinfo-os">{item.formatted.systemInfo?.os || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Host:</span>
                                                                <span className="info-value sysinfo-value sysinfo-host">{item.formatted.systemInfo?.host || 'localhost'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">User:</span>
                                                                <span className="info-value sysinfo-value sysinfo-user">{item.formatted.systemInfo?.user || 'Unknown'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="sysinfo-section">
                                                            <div className="sysinfo-category">HARDWARE</div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">CPU:</span>
                                                                <span className="info-value sysinfo-value sysinfo-cpu">{item.formatted.systemInfo?.cpu || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">GPU:</span>
                                                                <span className="info-value sysinfo-value sysinfo-gpu">{item.formatted.systemInfo?.gpu || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Resolution:</span>
                                                                <span className="info-value sysinfo-value sysinfo-resolution">{item.formatted.systemInfo?.resolution || 'Unknown'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="sysinfo-section">
                                                            <div className="sysinfo-category">NETWORK</div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Network:</span>
                                                                <span className="info-value sysinfo-value sysinfo-network">{item.formatted.systemInfo?.network || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">IP Address:</span>
                                                                <span className="info-value sysinfo-value sysinfo-ip">{item.formatted.systemInfo?.ipAddress || 'Unknown'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="sysinfo-section">
                                                            <div className="sysinfo-category">RUNTIME</div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Shell:</span>
                                                                <span className="info-value sysinfo-value sysinfo-shell">{item.formatted.systemInfo?.shell || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Uptime:</span>
                                                                <span className="info-value sysinfo-value sysinfo-uptime">{item.formatted.systemInfo?.uptime || 'Unknown'}</span>
                                                            </div>
                                                            <div className="info-line">
                                                                <span className="info-label sysinfo-label">Time:</span>
                                                                <span className="info-value sysinfo-value sysinfo-time">{item.formatted.systemInfo?.time || 'Unknown'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {item.formatted.items && (
                                                <div className="output-box-items">
                                                    {item.formatted.items.map((item, idx) => (
                                                        <div key={idx} className="output-box-item">
                                                            <span className="command-arrow">→</span> <span className="command-name">{item.cmd || item.name}</span> - <span className="command-desc">{item.desc}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.formatted.content && (
                                                <div className="output-box-content">{item.formatted.content}</div>
                                            )}
                                            {item.formatted.links && (
                                                <div className="output-box-links">
                                                    {item.formatted.links.map((link, idx) => (
                                                        <div key={idx} className="output-link-item">
                                                            <span className="link-icon">{link.icon || '→'}</span>
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="output-link"
                                                                style={{ color: link.color }}
                                                            >
                                                                {link.name}
                                                            </a>
                                                            <span className="link-url" style={{ color: '#888888' }}>
                                                                {link.url.replace(/^https?:\/\//, '')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {item.formatted.footer && (
                                                <div className="output-box-footer">
                                                    {typeof item.formatted.footer === 'string' ? (
                                                        item.formatted.footer
                                                    ) : (
                                                        <>
                                                            {item.formatted.footer.text}{' '}
                                                            {item.formatted.footer.link && (
                                                                <a
                                                                    href={item.formatted.footer.link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="footer-link"
                                                                >
                                                                    {item.formatted.footer.link.text}
                                                                </a>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : item.output ? (
                                        <div className="terminal-output">{item.output}</div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                    <div className="terminal-prompt-line terminal-input-line">
                        <span className="prompt-user">root</span>@<span className="prompt-host">photron</span>:<span className="prompt-dir">~</span>$
                        <input
                            ref={inputRef}
                            type="text"
                            className="terminal-input"
                            value={currentCommand}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            spellCheck="false"
                            placeholder="type a command..."
                        />
                        <span className="terminal-cursor-blink">█</span>
                        <button
                            type="button"
                            className="terminal-send-btn"
                            onClick={() => {
                                handleCommand(currentCommand);
                                setCurrentCommand('');
                                setHistoryIndex(-1);
                            }}
                            aria-label="Send command"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
            <LetterGlitch
                glitchSpeed={50}
                centerVignette={true}
                outerVignette={false}
                smooth={true}
            />
        </div>
    );
}


