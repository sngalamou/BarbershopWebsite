// test-db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const tls = require('tls');
const https = require('https');
const dns = require('dns');
const os = require('os');
const net = require('net');
require('dotenv').config();

const diagnoseMongoDBConnection = async () => {
  let client;
  let externalIp = 'Unknown'; // Initialize externalIp to fix reference error
  const connectionEvents = []; // Initialize connectionEvents array
  
  try {
    console.log('🔍 Advanced MongoDB Connection Diagnostic');
    console.log('Current Date/Time:', new Date().toISOString());

    // Get external IP for whitelisting check
    console.log('\n🌐 External IP Address Check:');
    try {
      externalIp = await checkExternalIp();
      console.log('Your External IP:', externalIp);
      console.log('⚠️ Make sure this IP is whitelisted in MongoDB Atlas Network Access settings');
    } catch (ipError) {
      console.error('Could not determine external IP:', ipError.message);
      externalIp = 'Could not determine';
    }

    // Extract connection details
    let connectionString = process.env.MONGODB_URI;
    
    // Fix the alternative connection string format
    // Note: Replace username:password with your actual credentials
    const alternativeConnectionString = "mongodb://simeonngalamou:EsXYn0AlB5Seo1Sg@ac-xgyfopa-shard-00-00.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-01.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-02.a2ljz4c.mongodb.net:27017/admin?replicaSet=atlas-wn7u45-shard-0&ssl=true&authSource=admin";

    if (!connectionString) {
      console.log('⚠️ MONGODB_URI not found in environment variables, using alternative connection string');
      connectionString = alternativeConnectionString;
    }
    
    if (!connectionString) {
      console.error('❌ Error: No valid connection string available.');
      console.log('Please ensure you have a .env file with the MONGODB_URI variable or update the alternativeConnectionString in the script.');
      return;
    }

    // Mask sensitive information
    const maskedConnectionString = connectionString.replace(/\/\/[^:]+:[^@]+@/, '//[CREDENTIALS_HIDDEN]@');
    console.log('\n🔑 Connection String:', maskedConnectionString);

    // Extract hostname and check connection string format
    let hostname, username, password, protocol;
    try {
      // Handle potential URL parsing issues by checking for encodeURIComponent
      // MongoDB connection strings might contain special characters that need proper encoding
      const sanitizedConnectionString = connectionString
        .replace(/\/\/(.*?):(.*?)@/, (match, user, pass) => {
          return `//${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`;
        });
      
      const url = new URL(sanitizedConnectionString);
      hostname = url.hostname;
      username = decodeURIComponent(url.username);
      password = decodeURIComponent(url.password);
      protocol = url.protocol;
      
      console.log('Protocol:', protocol);
      console.log('Host:', hostname);
      console.log('Username is present:', !!username);
      console.log('Password is present:', !!password);
      
      // Check for common issues in connection string
      if (!username || !password) {
        console.warn('⚠️ Warning: Missing credentials in connection string');
      }
      
      if (protocol !== 'mongodb+srv:' && protocol !== 'mongodb:') {
        console.warn('⚠️ Warning: Unusual protocol in connection string');
      }
    } catch (error) {
      console.error('❌ Error: Connection string parsing issue:', error.message);
      console.log('Attempting to proceed with direct connections to known shard nodes...');
    }

    // Try direct connections to the shard nodes
    console.log('\n🔌 Attempting direct connection to shard nodes:');
    const shardNodes = extractShardNodesFromLogs();
    for (const node of shardNodes) {
      try {
        console.log(`Testing TCP connection to ${node}:27017...`);
        await testTcpConnection(node, 27017);
      } catch (err) {
        console.error(`Failed to connect to ${node}:27017:`, err.message);
      }
    }

    // Creating client with comprehensive options
    const clientOptions = {
      serverApi: { 
        version: ServerApiVersion.v1, 
        strict: true, 
        deprecationErrors: true 
      },
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      
      // Basic SSL/TLS settings - simplify to avoid conflicts
      tls: true,
      // Don't use both of these together
      // tlsAllowInvalidCertificates: false,
      // tlsAllowInvalidHostnames: false,

      // Authentication
      authSource: 'admin'
    };

    console.log('\n🚀 Attempting Connection (with monitoring)...');
    
    // Create and connect the client with improved error handling
    try {
      // Use direct connection string to bypass potential SRV issues
      const directConnections = `mongodb://${simeonngalamou}:${EsXYn0AlB5Seo1Sg}@ac-xgyfopa-shard-00-00.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-01.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-02.a2ljz4c.mongodb.net:27017/admin?replicaSet=atlas-wn7u45-shard-0&ssl=true&authSource=admin`;
      
      console.log('Trying direct connection string format...');
      console.log(directConnections.replace(/\/\/[^:]+:[^@]+@/, '//[CREDENTIALS_HIDDEN]@'));
      
      client = new MongoClient(directConnections, clientOptions);
      
      // Set up event listeners for detailed logging
      client.on('commandStarted', (event) => {
        connectionEvents.push(`Command Started: ${event.commandName}`);
      });
      
      client.on('commandSucceeded', (event) => {
        connectionEvents.push(`Command Succeeded: ${event.commandName} (${event.duration}ms)`);
      });
      
      client.on('commandFailed', (event) => {
        connectionEvents.push(`Command Failed: ${event.commandName} - ${event.failure}`);
      });
      
      client.on('connectionPoolCreated', (event) => {
        connectionEvents.push(`Connection Pool Created: ${event.address}`);
      });

      // Set a reasonable timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timed out after 30 seconds")), 30000)
      );
      
      // Try connection
      await Promise.race([
        client.connect(),
        timeoutPromise
      ]);
      
      console.log('✅ Connection Successful!');

      // Verify database access
      try {
        console.log('\n📊 Attempting to list databases...');
        const adminDb = client.db('admin');
        const dbs = await adminDb.admin().listDatabases();
        
        console.log('✅ Successfully listed databases!');
        console.log('\n📋 Available Databases:');
        dbs.databases.forEach(db => {
          console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
        });
      } catch (dbError) {
        console.error('❌ Failed to list databases:', dbError.message);
        console.error('This may indicate permission issues with your MongoDB user');
      }
    } catch (connectionError) {
      console.error(`❌ Connection failed: ${connectionError.message}`);
      
      // Try with permissive TLS settings
      try {
        console.log('\n🔓 Trying with permissive TLS settings...');
        
        const permissiveOptions = {
          ...clientOptions,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true
        };

        const directConnections = `mongodb://${username}:${password}@ac-xgyfopa-shard-00-00.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-01.a2ljz4c.mongodb.net:27017,ac-xgyfopa-shard-00-02.a2ljz4c.mongodb.net:27017/admin?replicaSet=atlas-wn7u45-shard-0&ssl=true&authSource=admin`;
        
        // Close previous client if needed
        if (client) {
          await client.close();
        }
        
        client = new MongoClient(directConnections, permissiveOptions);
        
        // Set a reasonable timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Connection timed out after 30 seconds")), 30000)
        );
        
        await Promise.race([
          client.connect(),
          timeoutPromise
        ]);
        
        console.log('✅ Connection Successful with permissive TLS settings!');
        console.log('⚠️ Note: Using permissive TLS settings is less secure but useful for diagnosis');
        
        // Verify database access
        try {
          console.log('\n📊 Attempting to list databases...');
          const adminDb = client.db('admin');
          const dbs = await adminDb.admin().listDatabases();
          
          console.log('✅ Successfully listed databases!');
          console.log('\n📋 Available Databases:');
          dbs.databases.forEach(db => {
            console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
          });
        } catch (dbError) {
          console.error('❌ Failed to list databases:', dbError.message);
          console.error('This may indicate permission issues with your MongoDB user');
        }
      } catch (permissiveError) {
        console.error(`❌ Connection also failed with permissive TLS settings: ${permissiveError.message}`);
        throw permissiveError; // Rethrow to be caught by the outer catch
      }
    }

  } catch (error) {
    console.error('\n❌ Connection Diagnostic Failed:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);

    console.log('\n📋 Connection Events Log:');
    if (connectionEvents && connectionEvents.length > 0) {
      connectionEvents.forEach((event, i) => {
        console.log(`${i+1}. ${event}`);
      });
    } else {
      console.log('No connection events were logged');
    }

    // Final recommendations based on specific errors
    console.error('\n🚨 Final Recommendations:');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ENODATA')) {
      console.error('► DNS Resolution Issue:');
      console.error('1. Verify your MongoDB Atlas cluster name is correct');
      console.error('2. Try using a direct connection string instead of SRV format');
      console.error('3. Check your internet connection and DNS settings');
      console.error('4. Try flushing your DNS cache');
    }
    else if (error.message.includes('timed out')) {
      console.error('► Connection Timeout:');
      console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('2. Verify firewall or network security isn\'t blocking MongoDB ports');
      console.error('3. Try connecting from a different network');
    }
    else if (error.message.includes('tlsInsecure') || error.message.includes('ssl')) {
      console.error('► TLS/SSL Configuration Issue:');
      console.error('1. Update your MongoDB client options to resolve TLS conflicts');
      console.error('2. Check if your network is intercepting/inspecting SSL traffic');
    }
    else if (error.message.includes('Authentication failed')) {
      console.error('► Authentication Issue:');
      console.error('1. Verify your username and password are correct');
      console.error('2. Ensure your database user has appropriate permissions');
      console.error('3. Try creating a new database user with a simple password (no special characters)');
    }
    else if (error.message.includes('Invalid URL')) {
      console.error('► Connection String Format Issue:');
      console.error('1. Verify the format of your MongoDB connection string');
      console.error('2. Ensure special characters in username/password are properly encoded');
      console.error('3. Try using a direct connection string instead of SRV format');
    }
    else {
      console.error('► General Connection Issue:');
      console.error('1. Check all MongoDB Atlas settings (network access, database access)');
      console.error('2. Verify your connection string is correctly formatted');
      console.error('3. Try connecting from a different device or network');
    }

  } finally {
    // Ensure connection is closed
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed');
    }
    
    // Final summary - using externalIp that's now properly initialized
    console.log('\n📝 Troubleshooting Summary:');
    console.log('1. Check MongoDB Atlas Network Access to whitelist your IP:', externalIp);
    console.log('2. Verify your connection string in the .env file is correct');
    console.log('3. Try direct connection string format if SRV format fails');
    console.log('4. Disable antivirus/firewall temporarily to test connection');
    console.log('5. Try connecting from a different network (mobile hotspot, etc.)');
    
    console.log('\n💡 Next Steps for MongoDB Atlas:');
    console.log('1. Log into MongoDB Atlas and verify your cluster is active');
    console.log('2. Go to Network Access and add your current IP address');
    console.log('3. Check Database Access for correct username/password');
    console.log('4. Regenerate your connection string from the Atlas UI');
  }
};

// Extract shard nodes from previous logs
function extractShardNodesFromLogs() {
  // This would normally parse previous logs, but for simplicity:
  return [
    'ac-xgyfopa-shard-00-00.a2ljz4c.mongodb.net',
    'ac-xgyfopa-shard-00-01.a2ljz4c.mongodb.net', 
    'ac-xgyfopa-shard-00-02.a2ljz4c.mongodb.net'
  ];
}

// Test TCP connection to a host and port
function testTcpConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = 5000;
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      console.log(`  ✓ Successfully connected to ${host}:${port}`);
      socket.end();
      resolve();
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error(`Connection to ${host}:${port} timed out after ${timeout}ms`));
    });
    
    socket.on('error', (err) => {
      reject(err);
    });
    
    socket.connect(port, host);
  });
}

// Get external IP address
async function checkExternalIp() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      console.error('Error getting external IP:', err.message);
      resolve('Could not determine external IP');
    });
  });
}

// Execute the diagnostic
diagnoseMongoDBConnection().catch(console.error);