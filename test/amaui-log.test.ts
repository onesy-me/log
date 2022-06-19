/* tslint:disable: no-shadowed-variable */
import { assert } from '@amaui/test';

import { evaluate } from '../utils/js/test/utils';

import AmauiLog from '../src';

group('@amaui/log', () => {

  pre(async () => {
    AmauiLog.options.log.enabled = false;
  });

  post(async () => {
    AmauiLog.options.log.enabled = true;
  });

  preEveryGroupTo(() => AmauiLog.reset());

  group('AmauiLog', () => {

    group('log', () => {

      to('archive', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          (window.AmauiLog.options.log.archive = true) && window.AmauiLog.info('a') && window.AmauiLog.archive.length,
          (window.AmauiLog.options.log.archive = false) && window.AmauiLog.info('a') && window.AmauiLog.archive.length,
        ]);

        const valueNode = [
          (AmauiLog.options.log.archive = true) && AmauiLog.info('a') && AmauiLog.archive.length,
          (AmauiLog.options.log.archive = false) && AmauiLog.info('a') && AmauiLog.archive.length,
        ];

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          1,
          false
        ]));
      });

      to('enabled', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          (window.AmauiLog.options.log.enabled = true) && new window.AmauiLog().info('a').logged,
          (window.AmauiLog.options.log.enabled = false) && new window.AmauiLog().info('a').logged,
        ]);

        const valueNode = [
          (AmauiLog.options.log.enabled = true) && new AmauiLog().info('a').logged,
          (AmauiLog.options.log.enabled = false) && new AmauiLog().info('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

      });

      to('native', async () => {
        const valueBrowsers = await evaluate((window: any) => {
          const result = [];

          window.AmauiLog.options.log.native = true;

          result.push(new window.AmauiLog().info('a').method === console.info);

          window.AmauiLog.options.log.native = false;

          result.push(new window.AmauiLog().info('a').method === console.log);

          return result;
        });

        const result = [];

        AmauiLog.options.log.native = true;

        result.push(new AmauiLog().info('a').method === console.info);

        AmauiLog.options.log.native = false;

        result.push(new AmauiLog().info('a').method === console.log);

        const valueNode = result;

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          true
        ]));

        assert(valueNode).eql([
          true,
          true
        ]);
      });

      to('variants', async () => {
        AmauiLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          (window.AmauiLog.options.log.variants = ['info']) && new window.AmauiLog().info('a').logged,
          (window.AmauiLog.options.log.variants = ['info']) && new window.AmauiLog().warn('a').logged,
        ]);

        const valueNode = [
          (AmauiLog.options.log.variants = ['info']) && new AmauiLog().info('a').logged,
          (AmauiLog.options.log.variants = ['info']) && new AmauiLog().warn('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        AmauiLog.options.log.enabled = false;
      });

      group('padding', () => {

        to('top', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              (window.AmauiLog.options.log.padding.top = true) && window.AmauiLog.info('a').arguments,
              (window.AmauiLog.options.log.padding.top = false) || window.AmauiLog.info('a').arguments,
            ];
          });

          const valueNode = [
            (AmauiLog.options.log.padding.top = true) && AmauiLog.info('a').arguments,
            (AmauiLog.options.log.padding.top = false) || AmauiLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `${value[1][0].slice(0, 23)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `${valueNode[1][0].slice(0, 23)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        to('bottom', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              (window.AmauiLog.options.log.padding.bottom = true) && window.AmauiLog.info('a').arguments,
              (window.AmauiLog.options.log.padding.bottom = false) || window.AmauiLog.info('a').arguments,
            ];
          });

          const valueNode = [
            (AmauiLog.options.log.padding.bottom = true) && AmauiLog.info('a').arguments,
            (AmauiLog.options.log.padding.bottom = false) || AmauiLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `\n${value[1][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a'
            ],
          ]);
        });

      });

      group('variants', () => {

        to('all of the options', async () => {
          AmauiLog.variants.info.prefix = '/';
          AmauiLog.variants.info.sufix = '/';
          AmauiLog.variants.info.color = { browser: 'green', server: '34' };

          const valueBrowsers = await evaluate((window: any) => {
            window.AmauiLog.variants.info.prefix = '/';
            window.AmauiLog.variants.info.sufix = '/';
            window.AmauiLog.variants.info.color = { browser: 'green', server: '34' };

            return [
              window.AmauiLog.info('a').arguments,
            ];
          });

          const valueNode = [
            AmauiLog.info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c/info/: `,
              'color: green',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[34m/info/\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        group('pre', () => {

          group('subscription', () => {

            to('log', async () => {
              const valueNode = [];

              AmauiLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

              AmauiLog.log('log', 'a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.AmauiLog.variants.log.pre.subscription.subscribe(value => values.push(value));

                window.AmauiLog.log('log', 'a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

            to('info', async () => {
              const valueNode = [];

              AmauiLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

              AmauiLog.info('a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.AmauiLog.variants.log.pre.subscription.subscribe(value => values.push(value));

                window.AmauiLog.info('a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

          });

        });

        group('post', () => {

          group('subscription', () => {

            to('log', async () => {
              const valueNode = [];

              AmauiLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

              AmauiLog.log('log', 'a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.AmauiLog.variants.log.post.subscription.subscribe(value => values.push(value));

                window.AmauiLog.log('log', 'a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

            to('info', async () => {
              const valueNode = [];

              AmauiLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

              AmauiLog.info('a');

              const valueBrowsers = await evaluate((window: any) => {
                const values = [];

                window.AmauiLog.variants.log.post.subscription.subscribe(value => values.push(value));

                window.AmauiLog.info('a');

                return values;
              });

              const values = [valueNode, ...valueBrowsers];

              values.forEach(value => assert(value).eql([
                'a',
              ]));
            });

          });

        });

      });

      to('variantNames', async () => {
        const valueBrowsers = await evaluate((window: any) => window.AmauiLog.variantNames,);

        const valueNode = AmauiLog.variantNames;

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql(['log', 'debug', 'info', 'warn', 'error', 'important']));
      });

      to('variantsDefault', async () => {
        const valueBrowsers = await evaluate((window: any) => window.AmauiLog.variantsDefault,);

        const valueNode = AmauiLog.variantsDefault;

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          { name: 'log', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
          { name: 'debug', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
          { name: 'info', prefix: '(', sufix: ')', color: { browser: '#1fc926', server: '32' } },
          { name: 'warn', prefix: '(', sufix: ')', color: { browser: '#a9b030', server: '33' } },
          { name: 'error', prefix: '(', sufix: ')', color: { browser: '#d74644', server: '31' } },
          { name: 'important', prefix: '(', sufix: ')', color: { browser: '#ca00c5', server: '35' } },
        ]));
      });

    });

    to('log', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.log('info', 'a').arguments,
      ]);

      const valueNode = [
        AmauiLog.log('info', 'a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('debug', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.debug('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.debug('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(debug): `,
          'color: #0b9fc3',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[36m(debug)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('info', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.info('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.info('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    group('warn', () => {

      to('warn', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.warn('a').arguments,
        ]);

        const valueNode = [
          AmauiLog.warn('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.warn('a', []).arguments,
        ]);

        const valueNode = [
          AmauiLog.warn('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    group('error', () => {

      to('error', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.error('a').arguments,
        ]);

        const valueNode = [
          AmauiLog.error('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.error('a', []).arguments,
        ]);

        const valueNode = [
          AmauiLog.error('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    to('important', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.important('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.important('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(important): `,
          'color: #ca00c5',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[35m(important)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('archiveClear', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        window.AmauiLog.options.log.archive = true;

        window.AmauiLog.info('a');

        const result = [
          window.AmauiLog.archive.length,
        ];

        window.AmauiLog.archiveClear();

        result.push(window.AmauiLog.archive.length);

        return result;
      });

      AmauiLog.options.log.archive = true;

      AmauiLog.info('a');

      const result = [
        AmauiLog.archive.length,
      ];

      AmauiLog.archiveClear();

      result.push(AmauiLog.archive.length);

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([
        1,
        0,
      ]));
    });

    to('reset', async () => {
      AmauiLog.options.log.variants = ['info'];

      const valueBrowsers = await evaluate((window: any) => {
        window.AmauiLog.options.log.variants = ['info'];

        window.AmauiLog.reset();

        return [
          window.AmauiLog.options,
          window.AmauiLog.variants,
        ];
      });

      const valueNode = [
        AmauiLog.options,
        AmauiLog.variants,
      ];

      const values = [valueNode, ...valueBrowsers];

      values.forEach((value: any) => {
        assert(value[0]).eql({
          log: {
            enabled: true,
            native: true,
            padding: {
              top: true,
              bottom: true
            },
            variants: [
              'info'
            ]
          },
        });

        assert(Object.keys(value[1])).eql(['log', 'debug', 'info', 'warn', 'error', 'important']);

        assert(value[1].info.pre).exist;
        assert(value[1].info.post).exist;

        delete value[1].info.pre;
        delete value[1].info.post;

        assert(value[1].info).eql({
          name: 'info',
          prefix: '(',
          sufix: ')',
          color: {
            browser: '#1fc926',
            server: '32'
          },
        });
      });
    });

    group('color', () => {

      to('color', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.color('a', 'blue'),
          window.AmauiLog.color('a', 'green'),
          window.AmauiLog.color('a', 'orange'),
          window.AmauiLog.color('a', 'red'),
          window.AmauiLog.color('a', 'magenta'),
          window.AmauiLog.color('a', 'a'),
        ]);

        const valueNode = [
          AmauiLog.color('a', 'blue'),
          AmauiLog.color('a', 'green'),
          AmauiLog.color('a', 'orange'),
          AmauiLog.color('a', 'red'),
          AmauiLog.color('a', 'magenta'),
          AmauiLog.color('a', 'a'),
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          ['%ca', 'color: #0b9fc3'],
          ['%ca', 'color: #1fc926'],
          ['%ca', 'color: #a9b030'],
          ['%ca', 'color: #d74644'],
          ['%ca', 'color: #ca00c5'],
          ['%ca', 'color: #1fc926'],
        ]));
        assert(valueNode).eql([
          ['\x1B36ma\x1B[0m'],
          ['\x1B32ma\x1B[0m'],
          ['\x1B33ma\x1B[0m'],
          ['\x1B31ma\x1B[0m'],
          ['\x1B35ma\x1B[0m'],
          ['\x1B32ma\x1B[0m'],
        ]);
      });

      to('options', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.color('a', 'a', { browser: 'orange', server: 'orange' }),
        ]);

        const valueNode = [
          AmauiLog.color('a', 'a', { browser: 'orange', server: 'orange' }),
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          ['%ca', 'color: orange'],
        ]));
        assert(valueNode).eql([
          ['\x1Borangema\x1B[0m'],
        ]);
      });

    });

  });

  group('amauilog', () => {

    group('log', () => {

      to('archive', async () => {
        const valueBrowsers = await evaluate((window: any) => {
          const amauilog = new window.AmauiLog({ log: { archive: true } });

          amauilog.info('a');

          amauilog.options.log.archive = false;

          amauilog.info('a');

          return [
            amauilog.archive.length,
          ];
        });

        const amauilog = new AmauiLog({ log: { archive: true } });

        amauilog.info('a');

        amauilog.options.log.archive = false;

        amauilog.info('a');

        const valueNode = [
          amauilog.archive.length,
        ];

        const values = [valueNode, ...valueBrowsers];

        values.forEach(value => assert(value).eql([
          1,
        ]));
      });

      to('enabled', async () => {
        AmauiLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({
            log: {
              enabled: true,
            },
          }).info('a').logged,
          new window.AmauiLog({
            log: {
              enabled: false,
            },
          }).info('a').logged,
        ]);

        const valueNode = [
          new AmauiLog({
            log: {
              enabled: true,
            },
          }).info('a').logged,
          new AmauiLog({
            log: {
              enabled: false,
            },
          }).info('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        AmauiLog.options.log.enabled = false;
      });

      to('native', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({
            log: {
              native: true,
            },
          }).info('a').method === console.info,
          new window.AmauiLog({
            log: {
              native: false,
            },
          }).info('a').method === console.log,
        ]);

        const valueNode = [
          new AmauiLog({
            log: {
              native: true,
            },
          }).info('a').method === console.info,
          new AmauiLog({
            log: {
              native: false,
            },
          }).info('a').method === console.log,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          true
        ]));

        assert(valueNode).eql([
          true,
          true
        ]);
      });

      to('variants', async () => {
        AmauiLog.options.log.enabled = true;

        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({
            log: {
              variants: ['info'],
            },
          }).info('a').logged,
          new window.AmauiLog({
            log: {
              variants: ['info'],
            },
          }).warn('a').logged,
        ]);

        const valueNode = [
          new AmauiLog({
            log: {
              variants: ['info'],
            },
          }).info('a').logged,
          new AmauiLog({
            log: {
              variants: ['info'],
            },
          }).warn('a').logged,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          true,
          false
        ]));

        assert(valueNode).eql([
          true,
          false
        ]);

        AmauiLog.options.log.enabled = false;
      });

      group('padding', () => {

        to('top', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              new window.AmauiLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
              new window.AmauiLog({ log: { padding: { top: false, bottom: true } } }).info('a').arguments,
            ];
          });

          const valueNode = [
            new AmauiLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
            new AmauiLog({ log: { padding: { top: false, bottom: true } } }).info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `${value[1][0].slice(0, 23)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `${valueNode[1][0].slice(0, 23)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
          ]);
        });

        to('bottom', async () => {
          const valueBrowsers = await evaluate((window: any) => {
            return [
              new window.AmauiLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
              new window.AmauiLog({ log: { padding: { top: true, bottom: false } } }).info('a').arguments,
            ];
          });

          const valueNode = [
            new AmauiLog({ log: { padding: { top: true, bottom: true } } }).info('a').arguments,
            new AmauiLog({ log: { padding: { top: true, bottom: false } } }).info('a').arguments,
          ];

          valueBrowsers.forEach((value: any) => assert(value).eql([
            [
              `\n${value[0][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a\n\n'
            ],
            [
              `\n${value[1][0].slice(1, 24)} %c(info): `,
              'color: #1fc926',
              'a'
            ],
          ]));

          assert(valueNode).eql([
            [
              `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a\n'
            ],
            [
              `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
              'a'
            ],
          ]);
        });

      });

    });

    group('arguments', () => {

      to('all of the arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({
            arguments: {
              pre: ['a'],
              post: ['a'],
            },
          }).info('a').arguments,
        ]);

        const valueNode = [
          new AmauiLog({
            arguments: {
              pre: ['a'],
              post: ['a'],
            },
          }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            '\n\na\na\na\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            '\n\na\na\na\n'
          ],
        ]);
      });

    });

    group('variants', () => {

      to('all of the options', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({
            variants: {
              info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
            },
          }).info('a').arguments,
        ]);

        const valueNode = [
          new AmauiLog({
            variants: {
              info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
            },
          }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c/info/: `,
            'color: green',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[34m/info/\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      group('pre', () => {

        group('subscription', () => {

          to('log', async () => {
            const valueNode = [];

            const amauilog = new AmauiLog();

            AmauiLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));

            amauilog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const amauilog = new window.AmauiLog();

              window.AmauiLog.variants.log.pre.subscription.subscribe(value => values.push(value));

              amauilog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
            ]));
          });

          to('info', async () => {
            const valueNode = [];

            const amauilog = new AmauiLog({
              variants: {
                info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
              },
            });

            AmauiLog.variants.log.pre.subscription.subscribe(value => valueNode.push(value));
            amauilog.variants.info.pre.subscription.subscribe(value => valueNode.push(value));

            amauilog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const amauilog = new window.AmauiLog({
                variants: {
                  info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
                },
              });

              window.AmauiLog.variants.log.pre.subscription.subscribe(value => values.push(value));
              amauilog.variants.info.pre.subscription.subscribe(value => values.push(value));

              amauilog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
              'a',
            ]));
          });

        });

      });

      group('post', () => {

        group('subscription', () => {

          to('log', async () => {
            const valueNode = [];

            const amauilog = new AmauiLog();

            AmauiLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));

            amauilog.log('log', 'a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const amauilog = new window.AmauiLog();

              window.AmauiLog.variants.log.post.subscription.subscribe(value => values.push(value));

              amauilog.log('log', 'a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
            ]));
          });

          to('info', async () => {
            const valueNode = [];

            const amauilog = new AmauiLog({
              variants: {
                info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
              },
            });

            AmauiLog.variants.log.post.subscription.subscribe(value => valueNode.push(value));
            amauilog.variants.info.post.subscription.subscribe(value => valueNode.push(value));

            amauilog.info('a');

            const valueBrowsers = await evaluate((window: any) => {
              const values = [];

              const amauilog = new window.AmauiLog({
                variants: {
                  info: { name: 'info', prefix: '/', sufix: '/', color: { browser: 'green', server: '34' } },
                },
              });

              window.AmauiLog.variants.log.post.subscription.subscribe(value => values.push(value));
              amauilog.variants.info.post.subscription.subscribe(value => values.push(value));

              amauilog.info('a');

              return values;
            });

            const values = [valueNode, ...valueBrowsers];

            values.forEach(value => assert(value).eql([
              'a',
              'a',
            ]));
          });

        });

      });

    });

    group('date', () => {

      to('add', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({ date: { add: true } }).info('a').arguments,
          new window.AmauiLog({ date: { add: false } }).info('a').arguments,
        ]);

        const valueNode = [
          new AmauiLog({ date: { add: true } }).info('a').arguments,
          new AmauiLog({ date: { add: false } }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
          [
            `\n%c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
          [
            `\n\x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('method', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({ date: { method: () => 4 } }).info('a').arguments,
        ]);

        const valueNode = [
          new AmauiLog({ date: { method: () => 4 } }).info('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n4 %c(info): `,
            'color: #1fc926',
            'a\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n4 \x1B[32m(info)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

    });

    group('stringify', () => {

      to('method', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          new window.AmauiLog({ stringify: { method: () => 4 } }).info([1, 4]).arguments,
        ]);

        const valueNode = [
          new AmauiLog({ stringify: { method: () => 4 } }).info([1, 4]).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `\n${value[0][0].slice(1, 24)} %c(info): `,
            'color: #1fc926',
            '\n\n4\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
            '\n\n4\n'
          ],
        ]);
      });

    });

    to('log', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const error = new Error('a');

        error.stack = 'Error: a\n    at <anonymous>:1:24';

        return [
          window.AmauiLog.amauilog.log('info', 'a').arguments,
          window.AmauiLog.amauilog.log('info', [1, 3, 4]).arguments,
          window.AmauiLog.amauilog.log('info', 'a', 'a', 'a').arguments,
          window.AmauiLog.amauilog.log('info', 'a', 'a', 'a', [1, 3, 4], 'a').arguments,
          window.AmauiLog.amauilog.log('info', [1, 3, 4], 'a', [1, 3, 4]).arguments,
          window.AmauiLog.amauilog.log('info', [1, 3, 4], 'a', [1, 3, 4], 'a').arguments,
          window.AmauiLog.amauilog.log('info', [1, 3, 4], [1, { a: 4 }, 4], [1, 3, 4]).arguments,
          window.AmauiLog.amauilog.log('info', error).arguments,
        ];
      });

      const error = new Error('a');

      error.stack = 'Error: a\n    at <anonymous>:1:24';

      const valueNode = [
        AmauiLog.amauilog.log('info', 'a').arguments,
        AmauiLog.amauilog.log('info', [1, 3, 4]).arguments,
        AmauiLog.amauilog.log('info', 'a', 'a', 'a').arguments,
        AmauiLog.amauilog.log('info', 'a', 'a', 'a', [1, 3, 4], 'a').arguments,
        AmauiLog.amauilog.log('info', [1, 3, 4], 'a', [1, 3, 4]).arguments,
        AmauiLog.amauilog.log('info', [1, 3, 4], 'a', [1, 3, 4], 'a').arguments,
        AmauiLog.amauilog.log('info', [1, 3, 4], [1, { a: 4 }, 4], [1, 3, 4]).arguments,
        AmauiLog.amauilog.log('info', error).arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
        [
          `\n${value[1][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[2][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\na\na\n\n'
        ],
        [
          `\n${value[3][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\na\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n'
        ],
        [
          `\n${value[4][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[5][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n'
        ],
        [
          `\n${value[6][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\n[\n  1,\n  3,\n  4\n]\n\n[\n  1,\n  {\n    "a": 4\n  },\n  4\n]\n\n[\n  1,\n  3,\n  4\n]\n\n'
        ],
        [
          `\n${value[7][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          '\n\na\n\nError: a\n    at <anonymous>:1:24\n\n',
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
        [
          `\n${valueNode[1][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[2][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\na\na\n'
        ],
        [
          `\n${valueNode[3][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\na\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n'
        ],
        [
          `\n${valueNode[4][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[5][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\na\n\n[\n  1,\n  3,\n  4\n]\n\na\n'
        ],
        [
          `\n${valueNode[6][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\n[\n  1,\n  3,\n  4\n]\n\n[\n  1,\n  {\n    "a": 4\n  },\n  4\n]\n\n[\n  1,\n  3,\n  4\n]\n'
        ],
        [
          `\n${valueNode[7][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          '\n\na\n\nError: a\n    at <anonymous>:1:24\n',
        ],
      ]);
    });

    to('debug', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.amauilog.debug('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.amauilog.debug('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(debug): `,
          'color: #0b9fc3',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[36m(debug)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('info', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.amauilog.info('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.amauilog.info('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(info): `,
          'color: #1fc926',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[32m(info)\x1B[0m: `,
          'a\n'
        ],
      ]);

    });

    group('warn', () => {

      to('warn', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.amauilog.warn('a').arguments,
        ]);

        const valueNode = [
          AmauiLog.amauilog.warn('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.amauilog.warn('a', []).arguments,
        ]);

        const valueNode = [
          AmauiLog.amauilog.warn('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(warn): `,
            'color: #a9b030',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[33m(warn)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    group('error', () => {

      to('error', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.amauilog.error('a').arguments,
        ]);

        const valueNode = [
          AmauiLog.amauilog.error('a').arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            'a'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            'a\n'
          ],
        ]);
      });

      to('More than 1 arguments', async () => {
        const valueBrowsers = await evaluate((window: any) => [
          window.AmauiLog.amauilog.error('a', []).arguments,
        ]);

        const valueNode = [
          AmauiLog.amauilog.error('a', []).arguments,
        ];

        valueBrowsers.forEach((value: any) => assert(value).eql([
          [
            `${value[0][0].slice(0, 23)} %c(error): `,
            'color: #d74644',
            '\n\na\n\n[]\n\n'
          ],
        ]));

        assert(valueNode).eql([
          [
            `\n${valueNode[0][0].slice(1, 24)} \x1B[31m(error)\x1B[0m: `,
            '\n\na\n\n[]\n'
          ],
        ]);
      });

    });

    to('important', async () => {
      const valueBrowsers = await evaluate((window: any) => [
        window.AmauiLog.amauilog.important('a').arguments,
      ]);

      const valueNode = [
        AmauiLog.amauilog.important('a').arguments,
      ];

      valueBrowsers.forEach((value: any) => assert(value).eql([
        [
          `\n${value[0][0].slice(1, 24)} %c(important): `,
          'color: #ca00c5',
          'a\n\n'
        ],
      ]));

      assert(valueNode).eql([
        [
          `\n${valueNode[0][0].slice(1, 24)} \x1B[35m(important)\x1B[0m: `,
          'a\n'
        ],
      ]);
    });

    to('archiveClear', async () => {
      const valueBrowsers = await evaluate((window: any) => {
        const amauilog = new window.AmauiLog({ log: { archive: true } });

        amauilog.info('a');

        const result = [
          amauilog.archive.length,
        ];

        amauilog.archiveClear();

        result.push(amauilog.archive.length);

        return result;
      });

      const amauilog = new AmauiLog({ log: { archive: true } });

      amauilog.info('a');

      const result = [
        amauilog.archive.length,
      ];

      amauilog.archiveClear();

      result.push(amauilog.archive.length);

      const valueNode = result;

      const values = [valueNode, ...valueBrowsers];

      values.forEach(value => assert(value).eql([
        1,
        0,
      ]));
    });

  });

});
